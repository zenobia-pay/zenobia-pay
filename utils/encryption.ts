/**
 * Encrypts a string using AES-GCM encryption
 * @param data The string to encrypt
 * @param encryptionKey The encryption key
 * @returns Base64 encoded encrypted string
 */
export async function encrypt(
  data: string,
  encryptionKey: string
): Promise<string> {
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Import the encryption key
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  )

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(data)
  )

  // Combine IV and encrypted data
  const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength)
  encryptedArray.set(iv)
  encryptedArray.set(new Uint8Array(encryptedData), iv.length)

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...encryptedArray))
}

/**
 * Decrypts a base64 encoded encrypted string
 * @param encryptedData Base64 encoded encrypted string
 * @param encryptionKey The encryption key
 * @returns The decrypted string
 */
export async function decrypt(
  encryptedData: string,
  encryptionKey: string
): Promise<string> {
  // Convert base64 to Uint8Array
  const encryptedArray = new Uint8Array(
    atob(encryptedData)
      .split("")
      .map((c) => c.charCodeAt(0))
  )

  // Extract IV (first 12 bytes)
  const iv = encryptedArray.slice(0, 12)
  const data = encryptedArray.slice(12)

  // Import the encryption key
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  )

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  )

  // Convert back to string
  return new TextDecoder().decode(decryptedData)
}
