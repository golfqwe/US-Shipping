import { TrackingsModel } from '~/server/models/Trackings.model'
import { TrackingSchema } from '~/server/utils/validation.tracking'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = TrackingSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await TrackingsModel.create(body)
  setResponseStatus(201)
  return data
})
