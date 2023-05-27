import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  let where = {}
  if (session?.user?.role === 'user') {
    where = { status: 'active' }
  }
  const carrie = await LocalCarriersModel.findAll({ where })
  return carrie
})
