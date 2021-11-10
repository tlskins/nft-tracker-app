import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  createIcon,
  IconProps,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import SendPaymentToTreasury from '../components/SendPaymentToTreasury'
import { Notification } from '../components/notification'
import UserService from '../services/user.service'
import { globalContext } from '../store'
import { ICreateUserReq } from '../types/user'


export default function Homepage() {
  const { globalState, dispatch } = useContext( globalContext )
  const { publicKey } = useWallet()
  const [ newUser, setNewUser ] = useState( undefined as ICreateUserReq | undefined )
  const { user } = globalState

  console.log( 'globalState', globalState )

  useEffect(() => {
    if ( publicKey ) {
      console.log( 'public key!', publicKey.toString())
      signInUser( publicKey.toString())
    } else if ( !publicKey && user ) {
      signOutUser()
    }
  }, [ publicKey ])

  const signInUser = async ( walletPublicKey: string ): Promise<void> => {
    let user
    try {
      user = await UserService.get( walletPublicKey )
    } catch( err ) {
      console.log( 'err get user', err )

      return
    }

    if ( user ) {
      dispatch({ type: 'SET_USER', payload: user })
      toast.custom(
        <Notification
          message="Signed In!"
          variant="success"
        />,
      )
    } else {
      setNewUser({
        walletPublicKey,
        discordId: '',
      } as ICreateUserReq )
    }
  }

  const signOutUser = (): void => {
    dispatch({ type: 'SET_USER', payload: undefined })
    toast.custom(
      <Notification
        message="Signed Out!"
        variant="success"
      />
    )
  }

  const createUser = async (): Promise<void> => {
    if ( !newUser ) {return}
    let user
    try {
      user = await UserService.create( newUser )
    } catch( err ) {
      console.log( 'err get user', err )
      toast.custom(
        <Notification
          message={ `Error creating user: ${err}` }
          variant="error"
        />,
      )
    }

    if ( user ) {
      dispatch({ type: 'SET_USER', payload: user })
      setNewUser( undefined )
      toast.custom(
        <Notification
          message="Signed In!"
          variant="success"
        />,
      )
    }
  }

  return (
    <Container maxW={ '7xl' }>
      <Stack
        align={ 'center' }
        spacing={ { base: 8, md: 10 } }
        py={ { base: 20, md: 28 } }
        direction={ { base: 'column', md: 'row' } }
      >
        <Stack flex={ 1 } spacing={ { base: 5, md: 10 } }>
          <Stack spacing={{ base: 1, md: 2 }} width="xs">
            <Container>
              <WalletMultiButton />
            </Container>
            { user &&
              <Container>
                <WalletDisconnectButton />
                <SendPaymentToTreasury />
              </Container>
            }
          </Stack>
          <Heading
            lineHeight={ 1.1 }
            fontWeight={ 600 }
            fontSize={ { base: '3xl', sm: '4xl', lg: '6xl' } }
          >
            <Text
              as={ 'span' }
              textTransform="uppercase"
              letterSpacing={ 1.1 }
              position={ 'relative' }
              _after={ {
                content: '\'\'',
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'red.400',
                zIndex: -1,
              } }
            >
              Degen Bible
            </Text>
            <br />
            <Text as={ 'span' } color={ 'red.400' } fontSize={ { base: '2xl', sm: '3xl', lg: '4xl' } } letterSpacing={ .8 } >
              Unlock a higher power and save your SOLs!
            </Text>
          </Heading>
          <Text color={ 'gray.500' }>
            Stay up to date with all your listings through our
            discord channel that pushes the best listings to
            you immediately! Use our website to view listing
            metrics in detail and track market movements.
          </Text>
          <Stack
            spacing={ { base: 4, sm: 6 } }
            direction={ { base: 'column', sm: 'row' } }
          >
            <Button
              rounded={ 'full' }
              size={ 'lg' }
              fontWeight={ 'normal' }
              px={ 6 }
              colorScheme={ 'red' }
              bg={ 'red.400' }
              _hover={ { bg: 'red.500' } }
            >
              Get started
            </Button>
            <Button
              rounded={ 'full' }
              size={ 'lg' }
              fontWeight={ 'normal' }
              px={ 6 }
              leftIcon={ <PlayIcon h={ 4 } w={ 4 } color={ 'gray.300' } /> }
            >
              How It Works
            </Button>
          </Stack>

          { newUser &&
            <Box
              rounded={ 'lg' }
              bg={ useColorModeValue( 'white', 'gray.700' ) }
              boxShadow={ 'lg' }
              p={ 8 }
            >
              <Stack spacing={ 4 }>
                <FormControl id="wallet">
                  <FormLabel>Wallet</FormLabel>
                  <Input type="text" disabled={ true } value={ newUser.walletPublicKey } />
                </FormControl>
                <FormControl id="discordId">
                  <FormLabel>Discord User Name</FormLabel>
                  <Input
                    type="text"
                    value={ newUser.discordId }
                    onChange={ e => setNewUser({ ...newUser, discordId: e.target.value }) }
                  />
                </FormControl>
                <Stack spacing={ 10 }>
                  <Button
                    bg={ 'blue.400' }
                    color={ 'white' }
                    _hover={ { bg: 'blue.500' } }
                    onClick={ createUser }
                  >
                    Create User
                  </Button>
                </Stack>
              </Stack>
            </Box>
          }

        </Stack>
        <Flex
          flex={ 1 }
          justify={ 'center' }
          align={ 'center' }
          position={ 'relative' }
          w={ 'full' }
        >
          <Blob
            w={ '150%' }
            h={ '150%' }
            position={ 'absolute' }
            top={ '-20%' }
            left={ 0 }
            zIndex={ -1 }
            color={ useColorModeValue( 'red.50', 'red.400' ) }
          />
          <Box
            position={ 'relative' }
            height={ '600px' }
            rounded={ '2xl' }
            boxShadow={ '2xl' }
            width={ 'full' }
            overflow={ 'hidden' }
          >
            {/* <IconButton
              aria-label={ 'Play Button' }
              variant={ 'ghost' }
              _hover={ { bg: 'transparent' } }
              icon={ <PlayIcon w={ 12 } h={ 12 } /> }
              size={ 'lg' }
              color={ 'white' }
              position={ 'absolute' }
              left={ '50%' }
              top={ '50%' }
              transform={ 'translateX(-50%) translateY(-50%)' }
            /> */}
            <Image
              alt={ 'Hero Image' }
              fit={ 'cover' }
              align={ 'center' }
              w={ '100%' }
              h={ '100%' }
              src={
                'https://cdn.alpha.art/opt/e/c/ec36647eb825f38a10a81965e17d5018981295a6/original.webp'
              }
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  )
}

const PlayIcon = createIcon({
  displayName: 'PlayIcon',
  viewBox: '0 0 58 58',
  d:
    'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
})

export const Blob = ( props: IconProps ) => {
  return (
    <Icon
      width={ '100%' }
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      { ...props }
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  )
}
