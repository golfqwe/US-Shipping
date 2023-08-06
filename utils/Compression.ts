import imageCompression from 'browser-image-compression'

export const compressFile = async (file: File) => {
  if (!file) {
    return
  }

  const options = {
    maxSizeMB: 0.01,
    useWebWorker: true,
    alwaysKeepResolution: true,
    initialQuality: 0,
    fileType: 'image/webp'

  }

  try {
    const compressedFile = await imageCompression(file, options)

    // const image = await imageCompression.getDataUrlFromFile(compressedFile)
    return compressedFile
  } catch (error) {
    console.log(error)
  }
}
