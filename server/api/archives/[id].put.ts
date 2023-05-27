import { ArchivesModel } from '~/server/models/Archives.model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  await ArchivesModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(event, 202)
  return null
})
