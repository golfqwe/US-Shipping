import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const body = await readBody(event)
  await WareHouseModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(event, 202)
  return null
})
