import { WareHouseModel } from '~/server/models/Warehouse.model'

export default defineEventHandler(async (event) => {
  const { carrier, groupBy, status } = getQuery(event)
  let where = {}
  let tgroupBy = ''
  if (carrier) {
    where = {
      carrier,
      status: 'active'
    }
  }
  if (status) {
    where = {
      ...where,
      status
    }
  }

  if (groupBy) {
    tgroupBy = groupBy as string
  }
  const users = await WareHouseModel.findAll({ where, group: tgroupBy })
  return users
})
