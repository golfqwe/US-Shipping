import { Sequelize } from 'sequelize'
const config = useRuntimeConfig()

export const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
  host: config.DB_HOST,
  dialect: 'mariadb',
  logging: false
})
