import { MyAddressModel } from '~/server/models/MyAddress.model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  if (body.status === 'active') {
    await MyAddressModel.update({ status: 'inactive' }, {
      where: {
        createBy: body.createBy
      }
    })
  }

  await MyAddressModel.update(body, {
    where: {
      id
    }
  })
  setResponseStatus(202)
  return null
})
