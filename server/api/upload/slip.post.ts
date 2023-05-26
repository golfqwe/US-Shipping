import fs from 'fs'
import path from 'path'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const { files: { photo: [{ filepath, mimetype }] }, fields: { trackingId: [trackId] } } = await readFiles(event, {
    includeFields: true
  })

  const dir = `uploads-slip/track-id-${trackId}`

  if (!fs.existsSync('public/' + dir)) {
    fs.mkdirSync('public/' + dir, { recursive: true })
  }

  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()

  today = `${yyyy}${mm}${dd}`

  const imageName = String(today) + String(Math.round(Math.random() * 10000000))
  const newPath = `${path.join(dir, imageName)}.${mimetype.split('/')[1]}`
  fs.copyFileSync(filepath, path.join('public', newPath))

  return { pathFile: `\\${newPath}` }
})
