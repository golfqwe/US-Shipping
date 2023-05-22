import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async (event) => {
  const { carrier } = getQuery(event)
  let where = {}
  if (carrier) {
    where = {
      carrier,
      status: 'active'
    }
  }
  const users = await WareHouseModel.findAll({ where })
  return users
})
