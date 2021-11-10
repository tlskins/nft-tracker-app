import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import React, { FC, useCallback, useState, useContext } from 'react'
import {
  Box,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import toast from 'react-hot-toast'

import UserService from '../services/user.service'
import { IUser } from '../types/user'
import { Notification } from './notification'
import { globalContext } from '../store'


const LamportsInSol = 1000000000.0
const defaultSolAmt = 0.2

const SendPaymentToTreasury: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [ solAmount, setSolAmount ] = useState( defaultSolAmt )
  const { globalState, dispatch } = useContext( globalContext )
  const { user } = globalState

  const onClick = useCallback( (amount: number) => async () => {
    if ( !publicKey ) {throw new WalletNotConnectedError()}
    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS
    const treasuryKey = new PublicKey( treasuryAddress )
    const amountLamports = LamportsInSol * amount

    console.log('transaction', treasuryKey, amount, amountLamports)

    try {
      // send transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryKey,
          lamports: amountLamports,
        }),
      )
      const signature = await sendTransaction( transaction, connection )

      // confirm transaction
      const sigResult = await connection.confirmTransaction( signature, 'processed' )
      console.log( 'sigRes', sigResult )
      if ( !sigResult?.value || sigResult.value.err !== null ) {
        toast.custom(
          <Notification
            message={ `Error processing solana transaction: ${sigResult?.value?.err?.toString()}` }
            variant="error"
          />,
        )

        return
      }
    } catch( err ) {
      console.log('transaction err ', err)
      toast.custom(
        <Notification
          message={ `Error processing solana transaction: ${err?.toString()}` }
          variant="error"
        />,
      )
    }


    // update global store
    const updatedUser = await UserService.createTransaction({
      walletPublicKey: publicKey.toString(),
      toPublicKey: treasuryKey.toString(),
      amountLamports
    })
    if ( updatedUser ) {
      dispatch({ type: 'SET_USER', payload: updatedUser })
      setSolAmount(defaultSolAmt)
    }
  }, [ publicKey, sendTransaction, connection ])

  return (
    <FormControl as="fieldset" boxShadow="lg" padding="6" marginY="4">
      <Stack
        align={ 'center' }
        direction={ { base: 'column' } }
      >
        <FormLabel as="legend">Extend Subscription</FormLabel>
        <Button
          isLoading={ false }
          disabled={ !user || !publicKey }
          loadingText="Submitting"
          colorScheme="teal"
          variant="outline"
          onClick={ onClick( solAmount ) }
        >
          Submit { solAmount } SOL
        </Button>

        <Slider
          defaultValue={ defaultSolAmt }
          min={ 0.2 }
          max={ 5 }
          step={ 0.1 }
          onChange={ amt => setSolAmount( amt ) }
        >
          <SliderTrack bg="red.100">
            <Box position="relative" right={ 10 } />
            <SliderFilledTrack bg="tomato" />
          </SliderTrack>
          <SliderThumb boxSize={ 6 } />
        </Slider>
      </Stack>
      <FormHelperText> extend { ( solAmount * 7 * 5 ).toFixed( 2 ) } days </FormHelperText>
    </FormControl>
  )
}


export default SendPaymentToTreasury
