import { ArchivesModel } from '~/server/models/Archives.model'
import { ArchiveSchema } from '~/server/utils/validation.archive'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = ArchiveSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await ArchivesModel.create(body)
  setResponseStatus(201)
  return data
})
