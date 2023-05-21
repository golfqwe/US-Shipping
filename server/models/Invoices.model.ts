import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { MembersModel } from './Members.model'
import { ReceivesModel } from './Receiver.model'
import { InvoiceItemsModel } from './InvoiceItems.model'

export class InvoicesModel extends Model { }

InvoicesModel.init({
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  itemsId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'success']
  }
}, { sequelize, tableName: 'invoices' })

InvoicesModel.hasMany(InvoiceItemsModel)
InvoicesModel.belongsTo(MembersModel, { as: 'member' })
InvoicesModel.belongsTo(ReceivesModel, { as: 'receiver' })
