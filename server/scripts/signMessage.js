const secp = require('ethereum-cryptography/secp256k1')
const hashMessage = require('../utils/hashMessage')
const crypto = require('crypto')

const PRIVATE_KEY =
  '046642f6dd00aed4407197dbc2323e84504514ac3691f4ad49a5cc0286c5766676c8e705bb8c3b2da1f8b9f664f11f9127f058a7a242daa9c08f1b322e5c21de48'

async function signMessage() {
  const hashedMessage = hashMessage('Hello world!')
  const encoder = new TextEncoder()
  const data = encoder.encode(PRIVATE_KEY)
  const privateKey = crypto.createHash('sha256').update(data).digest('hex')
  const signed = await secp.sign(hashedMessage, privateKey, { recovered: true })
  return signed
}

module.exports = signMessage
