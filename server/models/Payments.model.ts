import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'
import { InvoicesModel } from './Invoices.model'
import { BookBankModel } from './BookBank.model'

export class PaymentsModel extends Model { }

PaymentsModel.init({
  invoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: InvoicesModel,
      key: 'id'
    }
  },
  bankId: {
    type: DataTypes.INTEGER,
    references: {
      model: BookBankModel,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  payDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  slipImage: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'payments' })
