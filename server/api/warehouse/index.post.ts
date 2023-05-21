import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await WareHouseModel.create(body)

  return data
})
