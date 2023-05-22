import { BookBankModel } from '~/server/models/BookBank.model'
import { BookBankSchema } from '~/server/utils/validation.bookBank'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = BookBankSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const data = await BookBankModel.create(body)
  setResponseStatus(201)
  return data
})
