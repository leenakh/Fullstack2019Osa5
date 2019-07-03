const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
        res.json(users.map(user => user.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.post('/', async (req, res, next) => {
    const body = req.body
    if (body.password === undefined) {
        return res.status(400).json({ error: 'Syötä salasana.' }).end()
    } else if (body.password.length < 3) {
        return res.status(400).json({ error: 'Salasanan täytyy olla vähintään 3 merkin pituinen.' }).end()
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    try {
        const savedUser = await user.save()
        res.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.delete('/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = usersRouter