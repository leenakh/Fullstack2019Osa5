const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
        console.log(users)
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

usersRouter.put('/:id', async (req, res, next) => {
    const body = req.body
    const user = {
        blogs: body.blogs
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true })
        res.json(updatedUser.toJSON())
    } catch (exception) {
        next(exception)
    }
})

usersRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if (user.username === 'admin') {
            await User.findByIdAndRemove(req.params.id)
            res.status(204).end()
        }
    } catch (exception) {
        console.log('Käyttäjän poistaminen ei onnistunut.')
    }
})

module.exports = usersRouter