import { LocalCarriersModel } from '~/server/models/LocalCarriers.model'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  await LocalCarriersModel.update(body, {
    where: {
      id
    }
  })

  setResponseStatus(event, 202)
  return null
})
