import { MyAddressModel } from '~/server/models/MyAddress.model'

export default defineEventHandler(async () => {
  const users = await MyAddressModel.findAll()
  return users
})
