import Joi from 'joi'

export const LocalCarrierSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').required()
})
