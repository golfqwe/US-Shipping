import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class LocalCarriersModel extends Model { }

LocalCarriersModel.init({
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'localCarriers' })
