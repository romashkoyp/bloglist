const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')

User.hasMany(Blog)
Blog.belongsTo(User)
//Blog.sync({ alter: true })
//User.sync({ alter: true })

User.belongsToMany(Blog, {
  through: Reading,
  foreignKey: 'user_id',
  as: 'readings'
 })
Blog.belongsToMany(User, {
  through: Reading,
  foreignKey: 'blog_id'
 })

module.exports = {
  Blog, User, Reading
}