import fs from 'fs'
import path from 'path'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const { files: { photo } } = await readFiles(event, {
    includeFields: true
  })

  const dir = 'public/uploads'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  for (const { filepath, mimetype } of Object.values(photo)) {
    const imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000))
    console.log('🚀 ~ file: index.post.ts:17 ~ defineEventHandler ~ imageName:', imageName)
    const newPath = `${path.join('public', 'uploads', imageName)}.${mimetype.split('/')[1]}`
    fs.copyFileSync(filepath, newPath)
  }

  return { success: true }
})
