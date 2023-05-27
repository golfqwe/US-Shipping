import { sequelize } from '~/server/utils/db.instance'
import { invoiceSchema } from '~/server/utils/validation.invoice'
import { InvoicesModel } from '~/server/models/Invoices.model'
import { InvoiceItemsModel } from '~/server/models/InvoiceItems.model'
import { TrackingsModel } from '~/server/models/Trackings.model'
import { MyAddressModel } from '~/server/models/MyAddress.model'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = invoiceSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const address = await MyAddressModel.findOne({
    where: { createBy: body.userId, status: 'active' }
  })

  const t = await sequelize.transaction()

  try {
    const inv = await InvoicesModel.create({ ...body, receiverId: address?.dataValues.id }, { transaction: t })

    await InvoiceItemsModel.bulkCreate(body.items.map(it => ({
      invoiceId: inv.dataValues.id,
      description: it.description,
      quantity: it.quantity,
      weight: it.weight,
      fee: it.fee
    })), { fields: ['invoiceId', 'description', 'quantity', 'weight', 'fee'], transaction: t })

    await TrackingsModel.update({
      status: 'waitpayment'
    }, {
      where: {
        id: body.trackingId
      },
      transaction: t
    })

    await t.commit()
    return body
  } catch (error) {
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    await t.rollback()
    throw createError({
      message: 'cannot insert invoice'
    })
  }
})
