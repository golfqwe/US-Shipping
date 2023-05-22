import { BookBankModel } from '~/server/models/BookBank.model'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  await BookBankModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(event, 202)
  return null
})
