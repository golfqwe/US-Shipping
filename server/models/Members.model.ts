import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class MembersModel extends Model { }

MembersModel.init({
  contact: {
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
  }
}, { sequelize, tableName: 'members' })
