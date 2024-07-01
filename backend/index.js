require('dotenv').config()
const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL);

//const dbConnect = async () => {
//  try {
//    await sequelize.authenticate()
//    console.log('Connected to Postgres.')
//    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
//    blogs.forEach(blog => {
//      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
//    })
//    console.log(blogs)
//    sequelize.close()
//  } catch (error) {
//    console.error('Unable to connect to the Postgres', error)
//  }
//}

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.use(express.json())

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  } else {
    await Blog.destroy({
      where: {
        id: `${blog.id}`
      }
    })
    console.log('Blog was deleted')
    return res.status(204).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})