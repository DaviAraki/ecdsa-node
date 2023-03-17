import { getEncodedPrivateKey } from './getPublicKey'
import { hashMessage } from './hashMessage'
import * as secp from 'ethereum-cryptography/secp256k1'

export async function signMessage(message) {
  const hash = hashMessage(message)
  const encodedPrivateKey = await getEncodedPrivateKey(privateKey)
  const signed = await secp.sign(hash, encodedPrivateKey, {
    recovered: true,
  })
  setSignature(signed)
}
