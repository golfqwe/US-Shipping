import { MyAddressModel } from '~/server/models/MyAddress.model'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const users = await MyAddressModel.findAll({
    where: { createBy: session?.user?.id }
  })
  return users
})
