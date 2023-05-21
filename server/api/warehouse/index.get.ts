import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async () => {
  const users = await WareHouseModel.findAll()
  return users
})
