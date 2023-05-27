import Joi from 'joi'

export const WareHouseSchema = Joi.object({
  country: Joi.string().required(),
  carrier: Joi.string().required(),
  address: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').required()
})
