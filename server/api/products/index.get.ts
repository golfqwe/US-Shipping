import { ProductsModel } from '~/server/models/Products.model'
import { getServerSession } from '#auth'
import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'
import { WareHouseModel } from '~/server/models/Warehouse.model'
import { UsersModel } from '~/server/models//Users.model'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const users = await ProductsModel.findAll({
    where: { userId: session?.user?.id },

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
