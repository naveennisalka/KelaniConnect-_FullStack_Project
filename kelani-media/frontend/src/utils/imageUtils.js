// Turns an image file picked by the user into a smaller image saved as text
// ("data:image/jpeg;base64,...."). We send this text to the backend like an image link.
// Making the image smaller keeps the database and the page fast.
export const resizeImage = (file, maxWidth = 1200) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file (JPG or PNG).'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        // Only make big images smaller, never make small images bigger
        const scale = Math.min(1, maxWidth / image.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)

        const context = canvas.getContext('2d')
        context.fillStyle = '#ffffff' // white background for transparent PNG images
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }

      image.onerror = () => reject(new Error('Could not read this image.'))
      image.src = reader.result
    }

    reader.onerror = () => reject(new Error('Could not read this file.'))
    reader.readAsDataURL(file)
  })
}
