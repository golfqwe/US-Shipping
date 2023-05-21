import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { InvoicesModel } from './Invoices.model'

export class InvoiceItemsModel extends Model { }

InvoiceItemsModel.init({
  invoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: InvoicesModel,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fee: {
    type: DataTypes.FLOAT,
    allowNull: false
  }

}, { sequelize, tableName: 'invoiceItems' })
