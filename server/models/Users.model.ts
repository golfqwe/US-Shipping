import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class UsersModel extends Model { }

UsersModel.init({
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'user']
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'users' })
