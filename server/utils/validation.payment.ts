import Joi from 'joi'

export const PaymentSchema = Joi.object({
  invoiceId: Joi.number().required(),
  bankId: Joi.number().required(),
  amount: Joi.number().required(),
  payDate: Joi.date().required(),
  // slipImage: Joi.string(),
  status: Joi.string().valid('pending', 'success').required()
})
