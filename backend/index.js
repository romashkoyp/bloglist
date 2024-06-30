require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to Postgres.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the Postgres', error)
  }
}

main()