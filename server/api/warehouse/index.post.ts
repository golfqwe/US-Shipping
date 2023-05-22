import { WareHouseModel } from '~/server/models/Warehouse.model'
import { WareHouseSchema } from '~/server/utils/validation.warehouse'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = WareHouseSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await WareHouseModel.create(body)

  return data
})
