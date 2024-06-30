import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

const blog = {
  id: '12345',
  title: 'My second blog with users connection',
  author: 'Me Uhgd',
  _url: 'http.www',
  likes: 10,
  user: {
    name: 'John'
  }
}

describe('Blog component', () => {
  let mockUpdate
  let mockSetBlogs

  beforeEach(() => {
    mockUpdate = vi.fn()
    blogService.update = mockUpdate
    mockSetBlogs = vi.fn()
  })

  test('like button clicked twice', async () => {

    const { container } = render(<Blog blog={blog} setBlogs={mockSetBlogs} />)
    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    const blogBigContent = container.querySelector('.bigBlog')
    expect(blogBigContent).not.toHaveStyle('display: none') //visible
    //screen.debug()
    const buttonLike = container.querySelector('.like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(mockUpdate).toHaveBeenCalledTimes(2)
  })
})
test('title and author blog visible, but url and likes - not', async () => {
  const { container } = render(<Blog blog={blog} />)
  //screen.debug()

  const blogSmallContent = container.querySelector('.smallBlog')
  console.log(`TEXT FROM BLOGCONTENT: ${blogSmallContent.textContent}`)
  expect(blogSmallContent).not.toHaveStyle('display: none') //visible
  expect(blogSmallContent).toHaveTextContent(`${blog.title} - ${blog.author}`)
  expect(blogSmallContent).not.toHaveTextContent(blog._url)
  expect(blogSmallContent).not.toHaveTextContent(blog.likes)

  const blogBigContent = container.querySelector('.bigBlog')
  expect(blogBigContent).toHaveStyle('display: none') //hidden
})

test('URL and likes are shown when the button \'view\' has been clicked', async () => {

  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  //screen.debug(button)
  await user.click(button)

  const blogBigContent = container.querySelector('.bigBlog')
  //screen.debug()
  expect(blogBigContent).not.toHaveStyle('display: none') //visible
  expect(blogBigContent).toHaveTextContent(blog._url)
  expect(blogBigContent).toHaveTextContent(blog.likes)

  const blogSmallContent = container.querySelector('.smallBlog')
  expect(blogSmallContent).toHaveStyle('display: none') //hidden
})