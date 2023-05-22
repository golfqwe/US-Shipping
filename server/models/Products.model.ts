import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { LocalCarriersModel } from './LocalCarriers.model'
import { WareHouseModel } from './Warehouse.model'

export class ProductsModel extends Model { }

ProductsModel.init({
  carrierId: {
    type: DataTypes.INTEGER,
    references: {
      model: LocalCarriersModel,
      key: 'id'
    }
  },
  wareHouseId: {
    type: DataTypes.INTEGER,
    references: {
      model: WareHouseModel,
      key: 'id'
    }
  },
  trackingNumber: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  carrier: {
    type: DataTypes.ENUM('Air', 'Ocean'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'products' })

LocalCarriersModel.hasOne(ProductsModel)
WareHouseModel.hasOne(ProductsModel)

ProductsModel.belongsTo(LocalCarriersModel, { as: 'localCarrier' })
ProductsModel.belongsTo(WareHouseModel, { as: 'wareHouse' })
