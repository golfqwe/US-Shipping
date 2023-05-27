import { ArchivesModel } from '~/server/models/Archives.model'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const { type } = getQuery(event)
  let where = {}
  if (session?.user?.role === 'user') {
    where = { status: 'active' }
  }
  if (type) {
    where = {
      ...where,
      type
    }
  }
  const archive = await ArchivesModel.findAll({ where })
  return archive
})
