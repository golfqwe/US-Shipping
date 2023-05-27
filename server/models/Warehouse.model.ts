import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class WareHouseModel extends Model { }

WareHouseModel.init({
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  carrier: {
    type: DataTypes.ENUM('Air', 'Ocean'),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'warehouse' })
