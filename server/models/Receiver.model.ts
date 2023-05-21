import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { MembersModel } from './Members.model'

export class ReceivesModel extends Model { }

ReceivesModel.init({
  contact: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(150),
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
  createBy: {
    type: DataTypes.INTEGER,
    references: {
      model: MembersModel,
      key: 'id'
    }
  }
}, { sequelize, tableName: 'members' })
