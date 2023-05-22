import Joi from 'joi'

export const MyAddressSchema = Joi.object({
  contact: Joi.string().required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').required()
})
