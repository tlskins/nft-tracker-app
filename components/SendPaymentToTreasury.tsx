import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import React, { FC, useCallback, useState, useContext } from 'react'
import {
  Box,
  Container,
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
import { toast } from 'react-toastify';

import UserService from '../services/user.service'
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
        throw(new Error(sigResult?.value?.err?.toString() || "Unknown"))
      }
    } catch( err ) {
      console.log('transaction err ', err)
      toast.success(`Error processing transaction in the Solana network: ${err}`, {
        position: toast.POSITION.TOP_CENTER
      })
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

  const extendedDays = `(${ ( solAmount * 7 * 5 ).toFixed( 1 ) } days)`

  return (
      <Box>
        <FormLabel htmlFor="paybtn">Extend Subscription { extendedDays }</FormLabel>
        <Box paddingX="4"
          paddingY="2"
          align="center"
          alignContent="center"
          mb="4"
        >
          <Slider
            defaultValue={ defaultSolAmt }
            min={ 0.2 }
            max={ 5 }
            step={ 0.1 }
            onChange={ amt => setSolAmount( amt ) }
          >
            <SliderTrack bg="gray.200">
              <Box position="relative" right={ 10 } />
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={ 6 } bg="blue.500" />
          </Slider>
        </Box>

        <Stack alignContent="center" alignItems="center">
          <Button
            id="paybtn"
            isLoading={ false }
            disabled={ !user || !publicKey }
            loadingText="Submitting"
            colorScheme="blue"
            size="sm"
            fontSize="xs"
            textTransform="uppercase"
            onClick={ onClick( solAmount ) }
          >
            Submit { solAmount } SOL
          </Button>
        </Stack>
      </Box>
  )
}


export default SendPaymentToTreasury
