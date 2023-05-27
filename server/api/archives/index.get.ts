import { ArchivesModel } from '~/server/models/Archives.model'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  let where = {}
  if (session?.user?.role === 'user') {
    where = { status: 'active' }
  }
  const bookbank = await ArchivesModel.findAll({ where })
  return bookbank
})
