import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import useField from './hooks/index'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [registrationVisible, setRegistrationVisible] = useState(false)
  const username = useField('text')
  const password = useField('password')
  const name = useField('text')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  useEffect(() => {
    console.log('loggedIn effect')
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      console.log('logged in:', user)
    }
  }, [])

  useEffect(() => {
    console.log('blogs effect')
    blogService
      .getAll()
      .then(initialBlogs => {
        console.log('blogs promise fulfilled')
        setBlogs(initialBlogs)
      })
  }, [])
  console.log('render', blogs.length, 'blogs')

  useEffect(() => {
    console.log('users effect')
    userService
      .getAll()
      .then(initialUsers => {
        console.log('users promise fulfilled')
        setUsers(initialUsers)
      })
  }, [blogs])
  console.log('newest user:', users[users.length - 1])

  const handleVote = (id) => {
    console.log('Tykätty', id)
    const blogToUpdate = blogs.find(blog => blog.id === id)
    const currentUser = users.find(u => u.username === user.username)
    console.log('current user:', currentUser)
    if (blogToUpdate.fans.find(f => f === currentUser.username)) {
      try {
        console.log('Tykkäsit jo tästä!')
        const newLikes = blogToUpdate.likes - 1
        const newFans = blogToUpdate.fans.filter(f => f !== currentUser.username)
        const updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
        blogService
          .update(blogToUpdate.id, updatedBlog)
          .then(returnedBlog => {
            setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : returnedBlog))
          })
        //setErrorMessage('Olet jo tykännyt tästä!')
        //setTimeout(() => { setErrorMessage(null) }, 5000)
      } catch (exception) {
        console.log('Pieleen meni.')
      }
    } else {
      try {
        const newLikes = blogToUpdate.likes + 1
        const newFans = blogToUpdate.fans.concat(currentUser.username)
        const updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
        blogService
          .update(blogToUpdate.id, updatedBlog)
          .then(returnedBlog => {
            setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : returnedBlog))
          })
      } catch (error) {
        console.log('Jotain meni pieleen. :(')
      }
    }
  }

  const handleRemove = async (id) => {
    const blogInQuestion = await blogs.find(blog => blog.id === id)
    if (window.confirm(`Haluatko varmasti poistaa kohteen ${blogInQuestion.title}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (exception) {
        console.log('Jotain meni pieleen. :(')
        await setErrorMessage('Jotain meni pieleen. :(')
        setTimeout(() => { setErrorMessage(null) }, 5000)
      }
    }
  }

  const handleRegistration = async (event) => {
    event.preventDefault()
    try {
      const newUser = {
        username: username.value,
        name: name.value,
        password: password.value
      }
      const result = await userService.create(newUser)
      if (result) {
        setUsers(users.concat(result))
        setNotification('Onnistui!')
        setTimeout(() => { setNotification(null) }, 5000)
        username.reset()
        name.reset()
        password.reset()
      }
    } catch (exception) {
      console.log('Jotain meni pieleen. :(')
      await setErrorMessage('Täytäthän kaikki kentät.')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value, password: password.value
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (error) {
      console.log(error)
      await setErrorMessage('Käyttäjätunnus tai salasana on virheellinen.', username.value, password.value)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      await window.localStorage.clear()
      setUser(null)
      setLoginVisible(false)
    } catch (exception) {
      console.log('Ei onnistunut!')
      await setErrorMessage('Jotain meni pieleen. :(')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value
    }
    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
    } catch (exception) {
      console.log('Uuden blogin luominen ei onnistunut.')
      await setErrorMessage('Uuden sivun lisääminen luetteloon ei onnistunut.')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
    await setNotification(`Luetteloon lisättiin sivu ${title.value} (tekijä: ${author.value}).`)
    setTimeout(() => { setNotification(null) }, 5000)
    title.reset()
    author.reset()
    url.reset()
    setBlogFormVisible(false)
    console.log('Blogia lisätään...', newBlog)
  }

  const Logout = (props) => {
    return (
      <button onClick={props.handleLogout}>Kirjaudu ulos</button>
    )
  }

  const sortedBlogs =
    blogs.sort(function (a, b) {
      if (a.likes < b.likes) {
        return 1
      }
      if (a.likes > b.likes) {
        return -1
      }
      return 0
    })

  const loggedInUsername = () => {
    if (user) {
      return user.username
    }
    return null
  }

  const rivit = sortedBlogs.map((blog) =>
    <Blog
      key={blog.id}
      blog={blog}
      handleVote={handleVote}
      handleRemove={handleRemove}
      username={loggedInUsername()}
    />
  )

  const showBlogs = () => {
    const hide = { display: blogFormVisible ? 'none' : '' }
    const show = { display: blogFormVisible ? '' : 'none' }
    return (
      <>
        <p><b>{user.name}</b> on kirjautunut sisään.</p>
        <p><Logout handleLogout={() => handleLogout()}></Logout></p>
        <div style={hide}>
          <button onClick={() => setBlogFormVisible(true)}>Lisää uusi sivu luetteloon</button>
        </div >
        <div>

        </div>
        <div style={show}><BlogForm
          handleAddBlog={handleAddBlog}
          title={title}
          author={author}
          url={url}
        />
          <button onClick={() => setBlogFormVisible(false)}>Peruuta</button>
        </div>
        <h1>Parhaat nettisivut</h1>
        <div>{rivit}</div>
      </>
    )
  }

  const handleLoginVisible = () => {
    setLoginVisible(true)
    setRegistrationVisible(false)
  }

  const handleRegistrationVisible = () => {
    setRegistrationVisible(true)
    setLoginVisible(false)
  }

  const showLoginForm = () => {
    const hide = { display: loginVisible ? 'none' : '' }
    const show = { display: loginVisible ? '' : 'none' }
    const hideRegistration = { display: registrationVisible ? 'none' : '' }
    const showRegistration = { display: registrationVisible ? '' : 'none' }
    return (
      <>
        <h1>Parhaat nettisivut</h1>
        <p style={hide}>
          <button onClick={handleLoginVisible}>Kirjaudu sisään</button>
        </p>
        <div style={show}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
          />
          <button onClick={() => setLoginVisible(false)}>Peruuta</button>
        </div>
        <p style={hideRegistration}>
          <button onClick={handleRegistrationVisible}>Rekisteröidy</button>
        </p>
        <div style={showRegistration}>
          <RegistrationForm
            handleRegistration={handleRegistration}
            name={name}
            username={username}
            password={password}
          />
          <button onClick={() => setRegistrationVisible(false)}>Peruuta</button>
        </div>
      </>
    )
  }

  return (
    <>
      <div><Notification message={errorMessage} type="error" /></div>
      <div><Notification message={notification} type="notification" /></div>

      {user === null ? showLoginForm() : showBlogs()}
    </>
  )
}

export default App
