import { UserModel } from '~/server/models/User.model'

export default defineEventHandler(async (event) => {
  // const users = await UserModel.findAll()
  return `Hello, ${event.context.params.id}!`
  return getMethod(event)
})
