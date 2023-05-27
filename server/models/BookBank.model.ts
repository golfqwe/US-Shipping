import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class BookBankModel extends Model { }

BookBankModel.init({
  accountName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  bankName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  branch: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  accountType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'bookbank' })
