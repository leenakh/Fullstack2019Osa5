import React from 'react'
import PropTypes from 'prop-types'

const Vote = ({ blog, username, handleVote }) => {
  let text = ''
  if (blog.fans.find(fan => fan === username)) {
    text = 'En tykkää'
  } else {
    text = 'Tykkään'
  }
  return (
    <button className="vote" onClick={handleVote}>
      {text}
    </button>
  )
}

const Remove = ({ handleRemove, blog, username }) => {
  if (blog.username === username) {
    return (
      <button className="remove" onClick={handleRemove}>
        Poista
      </button>
    )
  }
  return null
}

const Blog = ({ blog, handleVote, handleRemove, username }) => {
  return (
    <div className="table-frame">
      <table>
        <tbody>
          <tr>
            <td className="title-cell">Kirjoittaja ja otsikko</td>
            <td className="title-cell">Osoite<span className="username">{blog.username}</span></td>
          </tr>
          <tr>
            <td className="filled-cell">{blog.author}</td>
            <td className="fixed-size-cell"><a href={blog.url}>{blog.url}</a></td>
          </tr>
          <tr>
            <td className="filled-cell">{blog.title}</td>
            <td>{blog.likes} tykkää<Remove handleRemove={() => handleRemove(blog.id)} blog={blog} username={username} /><Vote blog={blog} username={username} handleVote={() => handleVote(blog.id)} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  username: PropTypes.string
}

export default Blog