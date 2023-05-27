import Joi from 'joi'

export const UserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'user').required(),
  status: Joi.string().valid('active', 'inactive').required()
})
