import { BookBankModel } from '~/server/models/BookBank.model'

export default defineEventHandler(async () => {
  const users = await BookBankModel.findAll()
  return users
})
