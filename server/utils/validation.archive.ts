import Joi from 'joi'

export const ArchiveSchema = Joi.object({
  content: Joi.string().required(),
  type: Joi.string().valid('nextDayService', 'auction', 'faq', 'customService').required(),
  status: Joi.string().valid('active', 'inactive').required()
})
