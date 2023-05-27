import Joi from 'joi'

export const invoiceSchema = Joi.object({
  trackingId: Joi.number().required(),
  status: Joi.string().valid('pending', 'success').required()
})
