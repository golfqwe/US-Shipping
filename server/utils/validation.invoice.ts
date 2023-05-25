import Joi from 'joi'

export const invoiceSchema = Joi.object({
  userId: Joi.number().required(),
  receiverId: Joi.number().required(),
  status: Joi.string().valid('pending', 'success').required()
})
