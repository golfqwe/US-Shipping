import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'
import { LocalCarrierSchema } from '~/server/utils/validation.localCarrier'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = LocalCarrierSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await LocalCarriersModel.create(body)

  return data
})
