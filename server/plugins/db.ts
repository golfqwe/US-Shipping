import { sequelize } from '../utils/db.instance'

export default defineNitroPlugin(async (nitro) => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
