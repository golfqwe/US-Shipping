import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  await WareHouseModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(202)
  return null
})
