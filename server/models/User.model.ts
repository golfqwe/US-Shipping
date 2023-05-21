import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class UserModel extends Model { }

UserModel.init({
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, { sequelize, tableName: 'users' })
