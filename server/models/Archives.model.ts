import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db.instance'

export class ArchivesModel extends Model { }

ArchivesModel.init({
  content: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('nextDayService', 'auction', 'faq', 'customService'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive']
  }
}, { sequelize, tableName: 'archives' })
