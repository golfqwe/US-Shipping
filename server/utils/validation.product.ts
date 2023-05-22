import Joi from 'joi'

export const ProductSchema = Joi.object({
  carrierId: Joi.number().required(),
  wareHouseId: Joi.number().required(),
  trackingNumber: Joi.string().required(),
  website: Joi.string().required(),
  description: Joi.string().required(),
  carrier: Joi.string().valid('Air', 'Ocean').required(),
  status: Joi.string().valid('active', 'inactive').required()
})
