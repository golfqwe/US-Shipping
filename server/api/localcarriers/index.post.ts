import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'
import { ProductSchema } from '~/server/utils/validation.product'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = ProductSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await LocalCarriersModel.create(body)
  setResponseStatus(201)
  return data
})
