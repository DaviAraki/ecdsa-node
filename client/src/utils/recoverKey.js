import * as secp from 'ethereum-cryptography/secp256k1'
import { hashMessage } from './hashMessage'

export async function recoverKey(message, signature, recoveryBit) {
  const hash = hashMessage(message)
  const publicKey = secp.recoverPublicKey(hash, signature, recoveryBit)
  return publicKey
}
