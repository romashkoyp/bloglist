import PropTypes from 'prop-types'

const BlogForm = ({
  onSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url,
  likes
}) => {
  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      _url: url,
      likes: likes,
    }

    onSubmit(blogObject)
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author
          <input
            id="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url
          <input
            id="url"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default BlogForm