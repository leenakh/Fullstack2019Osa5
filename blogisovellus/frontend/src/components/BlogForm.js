import React from 'react'

const BlogForm = ({ handleAddBlog, title, author, url }) => {
  return (
    <div className="blogform-frame">
      <form onSubmit={handleAddBlog}>
        <table>
          <tbody>
            <tr><td className="blog-form-cell">Otsikko</td><td><input className="blog-input" {... title} reset={null} /></td></tr>
            <tr><td className="blog-form-cell">Kirjoittaja</td><td><input className="blog-input" {... author} reset={null} /></td></tr>
            <tr><td className="blog-form-cell">Osoite</td><td><input className="blog-input" {... url} reset={null} /></td></tr>
            <tr><td><button className="blog-submit" type="submit">Lisää sivu!</button></td></tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default BlogForm