import { sequelize } from '~/server/utils/db.instance'
import { PaymentsModel } from '~/server/models/Payments.model'
import { PaymentSchema } from '~/server/utils/validation.payment'
import { TrackingsModel } from '~/server/models/Trackings.model'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = PaymentSchema.validate(body, {
    abortEarly: true,
    allowUnknown: true
  })

  if (error) {
    throw createError({
      message: error.message
    })
  }
  const t = await sequelize.transaction()

  try {
    const data = await PaymentsModel.create(body, { transaction: t })
    setResponseStatus(201)
    await TrackingsModel.update({
      status: 'paymented'
    }, {
      where: {
        id: body.trackingId
      },
      transaction: t
    })

    await t.commit()
    return data
  } catch (error) {
  // If the execution reaches this line, an error was thrown.
  // We rollback the transaction.
    await t.rollback()
    throw createError({
      message: 'cannot insert invoice'
    })
  }
})
