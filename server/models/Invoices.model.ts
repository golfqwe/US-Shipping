import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { UsersModel } from './Users.model'
import { MyAddressModel } from './MyAddress.model'
import { InvoiceItemsModel } from './InvoiceItems.model'

export class InvoicesModel extends Model { }

InvoicesModel.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: UsersModel,
      key: 'id'
    }
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
InvoicesModel.belongsTo(UsersModel, { as: 'userInfo' })
InvoicesModel.belongsTo(MyAddressModel, { as: 'myAddress' })
