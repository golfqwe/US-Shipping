import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'

export default defineEventHandler(async () => {
  const users = await LocalCarriersModel.findAll()
  return users
})
