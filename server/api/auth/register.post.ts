import { UsersModel } from '~/server/models/Users.model'
import { UserSchema } from '~/server/utils/validation.user'
import { cryptPassword } from '~~/server/utils/encype'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = UserSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const hashPassword = await cryptPassword(body.password)
  const data = await UsersModel.create({
    ...body,
    password: hashPassword
  })
  setResponseStatus(201)
  return data
})
