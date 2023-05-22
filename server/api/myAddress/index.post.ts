import { MyAddressModel } from '~/server/models/MyAddress.model'
import { MyAddressSchema } from '~/server/utils/validation.myAddress'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = MyAddressSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }

  await MyAddressModel.update({ status: 'inactive' }, {
    where: {
      createBy: body.createBy
    }
  })

  const data = await MyAddressModel.create(body)
  setResponseStatus(201)
  return data
})
