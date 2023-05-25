import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { UsersModel } from './Users.model'

export class MyAddressModel extends Model { }

MyAddressModel.init({
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
      model: UsersModel,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'myAddress' })

// MyAddressModel.belongsTo(UsersModel, { as: 'userInfo' })
