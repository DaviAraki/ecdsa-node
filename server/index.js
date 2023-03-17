const express = require('express')
const app = express()
const cors = require('cors')
const port = 3042
const { keccak256 } = require('ethereum-cryptography/keccak')
const { toHex } = require('ethereum-cryptography/utils')
const secp = require('ethereum-cryptography/secp256k1')
const hashMessage = require('./utils/hashMessage')

app.use(cors())
app.use(express.json())

const balances = {
  '41ad2bc63a2059f9b623533d87fe99887d794847': 100,
  d84d65c4ca103f1d1c8894860cd39f44cee85511: 50,
  c1a783b2ad89886004387ccd68a63e389100bba7: 75,
}

function getAddress(publicKey) {
  const withoutFirstByte = publicKey.slice(1)
  const withKeccack = keccak256(withoutFirstByte)
  const address = withKeccack.slice(withKeccack.length - 20)
  return address
}

async function recoverKey(message, signature, recoveryBit) {
  const hash = hashMessage(message)
  const publicKey = secp.recoverPublicKey(hash, signature, recoveryBit)
  return publicKey
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post('/send', async (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body
  const signatureArray = new Uint8Array(signature)
  const message = 'Hello World!'

  setInitialBalance(sender)
  setInitialBalance(recipient)

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    const publicKey = await recoverKey(message, signatureArray, recoveryBit)
    const hexAddress = toHex(getAddress(publicKey))
    if (sender !== hexAddress) {
      res.status(400).send({ message: 'Invalid signature!' })
    } else {
      balances[sender] -= amount
      balances[recipient] += amount
      res.send({ balance: balances[sender] })
    }
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
