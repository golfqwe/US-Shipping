import Joi from 'joi'

export const BookBankSchema = Joi.object({
  accountName: Joi.string().required(),
  bankName: Joi.string().required(),
  branch: Joi.string().required(),
  accountType: Joi.string().required(),
  accountNumber: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').required()
})
