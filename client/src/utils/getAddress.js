import { keccak256 } from 'ethereum-cryptography/keccak'

export function getAddress(publicKey) {
  const withoutFirstByte = publicKey.slice(1)
  const withKeccack = keccak256(withoutFirstByte)
  const address = withKeccack.slice(withKeccack.length - 20)
  return address
}
