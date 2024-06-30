const baseUrl = '/api/login'


const logout = () => {
  localStorage.removeItem('loggedBlogappUser')
  window.location.href = '/'
}

export default { logout }