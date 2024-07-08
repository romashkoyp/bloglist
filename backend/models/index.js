const Blog = require('./blog')
const User = require('./user')
const Session = require('./session')
const Reading = require('./reading')

// order of statements is crucial
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: Reading, as: 'readings' })
Blog.belongsToMany(User, { through: Reading, as: 'readinglists' })
User.hasMany(Blog)

module.exports = {
  Blog, User, Reading, Session
}