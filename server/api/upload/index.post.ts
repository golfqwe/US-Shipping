import fs from 'fs'
import path from 'path'
import { readFiles } from 'h3-formidable'
import { TrackingsModel } from '~/server/models/Trackings.model'

export default defineEventHandler(async (event) => {
  const { files: { photo }, fields: { trackingNumber: [tracNumber], trackingId: [id] } } = await readFiles(event, {
    includeFields: true
  })

  const dir = `uploads/track-${tracNumber}`

  if (!fs.existsSync('public/' + dir)) {
    fs.mkdirSync('public/' + dir)
  }

  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()

  today = `${yyyy}${mm}${dd}`

  const listImages = []

  for (const { filepath, mimetype } of Object.values(photo)) {
    const imageName = String(today) + String(Math.round(Math.random() * 10000000))
    const newPath = `${path.join(dir, imageName)}.${mimetype.split('/')[1]}`
    fs.copyFileSync(filepath, path.join('public', newPath))
    listImages.push(`\\${newPath}`)
  }

  TrackingsModel.update({ status: 'success', receiveDate: new Date().toISOString(), images: listImages.toString() }, { where: { id } })

  return { success: true }
})
