import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import React, { FC, useCallback, useState, useContext, useEffect } from 'react'
import {
  Box,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button,
  FormLabel,
} from '@chakra-ui/react'
import { toast } from 'react-toastify';

import UserService from '../services/user.service'
import { globalContext } from '../store'
import { IPricing } from '../types/user'


const LamportsInSol = 1000000000.0
const defaultSolAmt = 0.1

const SendPaymentToTreasury: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [ solAmount, setSolAmount ] = useState( defaultSolAmt )
  const [ pricing, setPricing ] = useState( undefined as IPricing | undefined)
  const { globalState, dispatch } = useContext( globalContext )
  const { user } = globalState

  useEffect(() => {
    syncPricing()
  }, [])

  const syncPricing = async (): Promise<void> => {
    const pricing = await UserService.getPricing()
    if ( pricing ) {
      setPricing( pricing )
    }
  }

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
      amountLamports,
      pricing,
    })
    if ( updatedUser ) {
      dispatch({ type: 'SET_USER', payload: updatedUser })
      setSolAmount(defaultSolAmt)
    }
  }, [ publicKey, sendTransaction, connection ])

  const wkLampsCost = pricing ? pricing.baseLamportsPerWeek + (pricing.numActive * pricing.lamportsPerActive) : 0.0
  const dailyLampsCost = pricing ? wkLampsCost / 7.0 : 0.0
  const extendedDays = `(${ ( solAmount * LamportsInSol / dailyLampsCost).toFixed( 1 ) } days)`

  return (
      <Box>
        <FormLabel htmlFor="paybtn">Extend Subscription { extendedDays }</FormLabel>
        <Text fontSize="sm" pl="1">
          Current price per week { (wkLampsCost / LamportsInSol).toFixed( 4 ) } SOL
        </Text>
        <Text fontSize="sm" pl="1">
          Active users { pricing?.numActive || "?" }
        </Text>
        <Box paddingX="4"
          paddingY="2"
          align="center"
          alignContent="center"
          mb="4"
        >
          <Slider
            defaultValue={ defaultSolAmt }
            min={ 0.1 }
            max={ 10 }
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
