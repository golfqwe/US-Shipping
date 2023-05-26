import fs from 'fs'
import path from 'path'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const { files: { photo: [{ filepath, mimetype }] } } = await readFiles(event, {
    includeFields: true
  })

  const dir = 'public/uploads'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000))
  const newPath = `${path.join('public', 'uploads', imageName)}.${mimetype.split('/')[1]}`
  fs.copyFileSync(filepath, newPath)

  return { success: true }
})
