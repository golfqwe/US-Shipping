import { getServerSession } from '#auth'
import { TrackingsModel } from '~/server/models/Trackings.model'
import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'
import { WareHouseModel } from '~/server/models/Warehouse.model'
import { UsersModel } from '~/server/models//Users.model'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  let where = {}
  if (session?.user?.role === 'user') {
    where = { userId: session?.user?.id }
  }

  const users = await TrackingsModel.findAll({
    where,

    include: [
      {
        model: UsersModel
      },
      {
        model: LocalCarriersModel
      },
      {
        model: WareHouseModel
      }

    ]

  })
  return users
})
