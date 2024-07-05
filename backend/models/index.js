const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')

// order of statements is crucial
User.belongsToMany(Blog, { through: Reading, as: 'readings' })
Blog.belongsToMany(User, { through: Reading })
User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog, User, Reading
}