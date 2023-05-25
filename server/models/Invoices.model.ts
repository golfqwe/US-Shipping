import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { TrackingsModel } from './Trackings.model'
import { MyAddressModel } from './MyAddress.model'
import { InvoiceItemsModel } from './InvoiceItems.model'

export class InvoicesModel extends Model { }

InvoicesModel.init({
  trackingId: {
    type: DataTypes.INTEGER,
    references: {
      model: TrackingsModel,
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    references: {
      model: MyAddressModel,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'success']
  }
}, { sequelize, tableName: 'invoices' })

InvoicesModel.hasMany(InvoiceItemsModel)
InvoicesModel.belongsTo(TrackingsModel, { foreignKey: 'trackingId' })
InvoicesModel.belongsTo(MyAddressModel, { as: 'receiverId' })
