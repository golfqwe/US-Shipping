import { InvoicesModel } from '~/server/models/Invoices.model'
import { InvoiceItemsModel } from '~/server/models/InvoiceItems.model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  if (!Number.isInteger(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer'
    })
  }

  InvoicesModel.hasMany(InvoiceItemsModel, { sourceKey: 'id', foreignKey: 'invoiceId' })

  const invoice = await InvoicesModel.findOne({
    where: { trackingId: id },
    include: { model: InvoiceItemsModel }
  })
  return invoice
})
