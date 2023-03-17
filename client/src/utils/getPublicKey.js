import * as secp from 'ethereum-cryptography/secp256k1'

export async function getPublicKey(privateKey) {
  const encodedPrivateKey = await getEncodedPrivateKey(privateKey)
  const publicKey = secp.getPublicKey(encodedPrivateKey)

  return publicKey
}

export async function getEncodedPrivateKey(privateKey) {
  const encoder = new TextEncoder()
  const data = encoder.encode(privateKey)
  const hash = await window.crypto.subtle.digest('SHA-256', data)
  const encodedPrivateKey = new Uint8Array(hash)

  return encodedPrivateKey
}
