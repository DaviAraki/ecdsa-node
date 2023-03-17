import server from './server'
import * as secp from 'ethereum-cryptography/secp256k1'
import { toHex } from 'ethereum-cryptography/utils'
import { getEncodedPrivateKey, getPublicKey } from './utils/getPublicKey'
import { hashMessage } from './utils/hashMessage'
import { getAddress } from './utils/getAddress'
import { recoverKey } from './utils/recoverKey'

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  setSignature,
}) {
  async function onChange(evt) {
    const imputedPrivateKey = evt.target.value
    setPrivateKey(imputedPrivateKey)
    const message = 'Hello World!'
    const signed = await signMessage(message)
    setSignature(signed)
    const publicKey = await recoverKey(message, signed[0], signed[1])
    const address = toHex(getAddress(publicKey))
    setAddress(address)

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`)
      setBalance(balance)
    } else {
      setBalance(0)
    }
  }

  async function signMessage(message) {
    const hash = hashMessage(message)
    const encodedPrivateKey = await getEncodedPrivateKey(privateKey)
    const signed = await secp.sign(hash, encodedPrivateKey, {
      recovered: true,
    })
    return signed
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        PrivateKey
        <input
          placeholder='Type in a private key'
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>Address: {address}</div>

      <div className='balance'>Balance: {balance}</div>
    </div>
  )
}

export default Wallet
