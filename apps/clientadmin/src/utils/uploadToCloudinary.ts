export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unsigned_upload') // helyettesítsd be
  formData.append('api_key', '122962497872222') // csak ha szükséges (általában nem kell frontendre)
  
  const res = await fetch('https://api.cloudinary.com/v1_1/deul9cp9s/image/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}