import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { LocalCarriersModel } from './LocalCarriers.model'
import { WareHouseModel } from './Warehouse.model'
import { UsersModel } from './Users.model'

export class TrackingsModel extends Model { }

TrackingsModel.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: UsersModel,
      key: 'id'
    }
  },
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
    values: ['pending', 'waitpayment', 'paymented', 'waiting', 'success'],
    get () {
      const status = this.getDataValue('status')
      const result = {
        code: status,
        desc: ''
      }
      switch (status) {
        case 'pending':
          result.desc = 'รอแจ้งบิลค่าขนส่ง'
          break
        case 'waitpayment':
          result.desc = 'รอชำละบิลค่าขนส่ง'
          break
        case 'paymented':
          result.desc = 'แจ้งชำละแล้ว รอตรวจสอบ'
          break
        case 'waiting':
          result.desc = 'รอสินค้ามาถึง'
          break
        case 'success':
          result.desc = 'สำเร็จ'
          break
      }
      return result
    }
  }
}, { sequelize, tableName: 'trackings' })

TrackingsModel.belongsTo(UsersModel, { foreignKey: 'userId' })
TrackingsModel.belongsTo(LocalCarriersModel, { foreignKey: 'carrierId' })
TrackingsModel.belongsTo(WareHouseModel, { foreignKey: 'wareHouseId' })
