import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, user }) => {
  const [contentVisible, setContentVisible] = useState(false)
  const [viewCallCount, setViewCallCount] = useState(0)
  const [likeCallCount, setLikeCallCount] = useState(0)

  useEffect(() => {
    console.log(`Button "view"/"hide" clicked ${viewCallCount} times for blog with ID: ${blog.id}`)
  }, [viewCallCount, blog.id])

  useEffect(() => {
    console.log(`Button "like" clicked ${likeCallCount} times for blog with ID: ${blog.id}`)
  }, [likeCallCount, blog.id])

  const showRemoveButton = user && blog.user && user.id === blog.user.id

  const hideContent = {
    display: contentVisible ? 'none' : '',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showContent = {
    display: contentVisible ? '' : 'none',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const updatedBlogResponse = await blogService.update(blog.id, updatedBlog)
    setBlogs((prevBlogs) =>
      prevBlogs.map((prevBlog) => (prevBlog.id === updatedBlogResponse.id ? { ...prevBlog, ...updatedBlogResponse } : prevBlog))
    )
    setLikeCallCount(prevCount => prevCount + 1)
  }

  const handleDeleteBlog = async (id) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      await blogService._delete(id)
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id))
    }
  }

  const handleVisibility = async (event) => {
    event.preventDefault()
    setContentVisible(!contentVisible)
    setViewCallCount(prevCount => prevCount + 1)
  }

  return (
    <div>
      <div style={hideContent} className='smallBlog'>
        <div>
          {blog.title} - {blog.author} <button onClick={handleVisibility}>view</button>
        </div>
      </div>
      <div style={showContent} className='bigBlog'>
        <div>
          {blog.title} - {blog.author} <button onClick={handleVisibility}>hide</button>
        </div>
        <div>{blog._url}</div>
        <div>likes {blog.likes} <button className='like' onClick={handleLikes}>like</button></div>
        <div>{blog.user.name}</div>
        {showRemoveButton && <button onClick={() => handleDeleteBlog(blog.id)}>remove blog</button>}
      </div>
    </div>
  )}

export default Blog