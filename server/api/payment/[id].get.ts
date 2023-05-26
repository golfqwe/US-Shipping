import { PaymentsModel } from '~/server/models/Payments.model'
import { InvoicesModel } from '~/server/models/Invoices.model'
import { BookBankModel } from '~/server/models/BookBank.model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  if (!Number.isInteger(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer'
    })
  }

  const invoice = await InvoicesModel.findOne({
    where: { trackingId: id }
  })

  PaymentsModel.hasOne(BookBankModel, { sourceKey: 'bankId', foreignKey: 'id' })
  const payment = await PaymentsModel.findOne({
    where: { invoiceId: invoice?.dataValues.id },
    include: BookBankModel
  })
  return payment
})
