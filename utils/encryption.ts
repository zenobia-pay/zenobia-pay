// aes-gcm.js

// lossless base64 helpers
function uint8ToBase64(uint8) {
  let binary = ""
  for (let i = 0; i < uint8.length; i++) {
    binary += String.fromCharCode(uint8[i])
  }
  return btoa(binary)
}

function base64ToUint8(base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// encrypts a string into base64 using AES-GCM
export async function encrypt(data, encryptionKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const salt = new TextEncoder().encode("ZenobiaPaySalt")

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  )

  const encoded = new TextEncoder().encode(data)
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  )

  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return uint8ToBase64(combined)
}

// decrypts a base64 AES-GCM string
export async function decrypt(encryptedBase64, encryptionKey) {
  const combined = base64ToUint8(encryptedBase64)
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)
  const salt = new TextEncoder().encode("ZenobiaPaySalt")

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  )

  return new TextDecoder().decode(decrypted)
}
