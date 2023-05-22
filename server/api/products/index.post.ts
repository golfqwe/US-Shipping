import { ProductsModel } from '~/server/models/Products.model'
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
  const data = await ProductsModel.create(body)
  setResponseStatus(201)
  return data
})
