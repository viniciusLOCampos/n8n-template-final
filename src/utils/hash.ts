export const generateHash = async (): Promise<string> => {
  const randomString = Math.random().toString(36) + Date.now().toString()
  const encoder = new TextEncoder()
  const data = encoder.encode(randomString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.replace(/[^a-zA-Z0-9]/g, '')
}
