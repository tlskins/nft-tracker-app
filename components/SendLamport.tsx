import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import React, { FC, useCallback } from 'react'

const LamportsInSol = 1000000000.0

export const SendOneLamportToRandomAddress: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const onClick = useCallback( async () => {
    if ( !publicKey ) {throw new WalletNotConnectedError()}
    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS
    console.log( 'treasuryAddress', treasuryAddress )
    const treasuryKey = new PublicKey( treasuryAddress )
    console.log( 'treasuryKey', treasuryKey )

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        // toPubkey: Keypair.generate().publicKey,
        toPubkey: treasuryKey,
        lamports: 0.1 * LamportsInSol,
      }),
    )

    const signature = await sendTransaction( transaction, connection )

    const sigResult = await connection.confirmTransaction( signature, 'processed' )
    console.log( 'sigRes', sigResult )
    if ( sigResult?.value && sigResult?.value.err === null ) {
      console.log( 'transactions sucessful!' )
    }
  }, [ publicKey, sendTransaction, connection ])

  return (
    <button onClick={ onClick } disabled={ !publicKey }>
        Send 1 lamport to a random address!
    </button>
  )
}
