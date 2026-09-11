import fs from 'fs'

export const deleteFiles = (files) => {
  if (!files) return
  files.forEach(file => {
    fs.unlink(file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err)
    })
  })
}