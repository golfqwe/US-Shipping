import { TrackingsModel } from '~/server/models/Trackings.model'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  await TrackingsModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(event, 202)
  return null
})
