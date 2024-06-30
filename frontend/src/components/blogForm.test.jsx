import { render, screen } from '@testing-library/react'
import BlogForm from './blogForm'
import userEvent from '@testing-library/user-event'

test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render( <BlogForm
    onSubmit={createBlog}
    handleTitleChange={() => {}}
    handleAuthorChange={() => {}}
    handleUrlChange={() => {}}
    title="testing Title"
    author="testing Author"
    url="testing URL"
  />)

  const createButton = screen.getByText('create')

  console.log('view of blog form with filled input fields')
  screen.debug()
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledTimes(1)

  console.log('content of createBlog.mock.calls')
  console.log(createBlog.mock.calls[0])

  expect(createBlog).toHaveBeenCalledWith({
    title: 'testing Title',
    author: 'testing Author',
    _url: 'testing URL'
  })
})