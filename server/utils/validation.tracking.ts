import Joi from 'joi'

export const TrackingSchema = Joi.object({
  userId: Joi.number().required(),
  carrierId: Joi.number().required(),
  wareHouseId: Joi.number().required(),
  trackingNumber: Joi.string().required(),
  website: Joi.string().required(),
  description: Joi.string().required(),
  carrier: Joi.string().valid('Air', 'Ocean').required(),
  status: Joi.string().valid('pending', 'payment', 'waiting', 'success').required()
})
