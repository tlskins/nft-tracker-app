import { useState, useEffect, useContext } from 'react'
import {
  createIcon,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Text,
  Select,
  Stack,
  Switch,
  Container,
  useColorModeValue,
  SimpleGrid,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineDown } from 'react-icons/ai'

import { userIsActive } from '../../types/user'
import { ITokenTracker, Nft } from '../../types/tokens'
import UnauthorizedHero from '../../components/UnauthorizedHero'
import { globalContext } from '../../store'
import WalletService from '../../services/wallet.service'
import userService from '../../services/user.service'


export default function WalletManager() {
  const { globalState: { user }, dispatch } = useContext( globalContext )
  const [ walletLoaded, setWalletLoaded ] = useState( false )
  const [ tokTrackers, setTokTrackers ] = useState(new Map() as Map<string, ITokenTracker[]>)
  const [ untrackedNfts, setUntrackedNfts ] = useState([] as Nft[])
  const [ trackerTypes, setTrackerTypes ] = useState([] as string[])
  const [ collections, setCollections ] = useState([] as string[])
  const [ trackersSaving, setTrackersSaving ] = useState(new Map() as Map<string, boolean>)
  const [ newWalletAddr, setNewWalletAddr ] = useState("")

  useEffect(() => {
    if ( !walletLoaded && user ) {
        loadWallet()
    }
  }, [ user ])

  const loadWallet = async (): Promise<void> => {
    const walletResp = await WalletService.getWallet()
    if ( walletResp ) {
        const collections = []
        const tokTrackers = new Map<string, ITokenTracker[]>();
        walletResp.tracked.forEach( tracker => {
            const coll = tracker.token?.collection
            if ( coll ) {
                if ( !tokTrackers.get(coll) ) {
                    tokTrackers.set(coll, [])
                    collections.push(coll)
                }
                const updTrackers = tokTrackers.get(coll)
                tokTrackers.set(coll, [...updTrackers, tracker])
            }
        })

        setCollections(collections)
        setTokTrackers( tokTrackers )
        setUntrackedNfts( walletResp.untracked )
        setTrackerTypes( walletResp.tokenTrackingTypes )
        setWalletLoaded(true)
    }
  }

  const updateTracker = (coll: string, tracker: ITokenTracker) => {
    const trackers = tokTrackers.get(coll)
    const idx = trackers.findIndex( trk => trk.id === tracker.id )
    const newTrks = new Map(tokTrackers.set(coll, [
        ...trackers.slice(0, idx),
        {...tracker},
        ...trackers.slice(idx+1, trackers.length)
    ]))
    setTokTrackers(newTrks)
  }

  const saveTokenTracker = (coll: string, tracker: ITokenTracker) => async(): Promise<void> => {
    const update = {
        id: tracker.id,
        active: tracker.active,
        tokenTrackerType: tracker.tokenTrackerType,
        above: tracker.above,
        below: tracker.below,
    }
    let currValue = tracker.tokenTrackerType === "Suggested Price" ?
        tracker.token?.suggestedPrice
        :
        tracker.token?.floorPrice
    if ( currValue == null ) currValue = 0

    if ( !update.tokenTrackerType ) {
        toast.error( "Missing tracking type", {
            position: toast.POSITION.TOP_CENTER,
        })
        return
    }
    if ( update.above < currValue ) {
        toast.error( "Cannot set 'above' lower than current value", {
            position: toast.POSITION.TOP_CENTER,
        })
        return
    }
    if ( update.below > currValue ) {
        toast.error( "Cannot set 'below' higher than current value", {
            position: toast.POSITION.TOP_CENTER,
        })
        return
    }
    if ( update.active && update.above == null && update.below == null ) {
        toast.error( "Must have at least one range set for an active alert", {
            position: toast.POSITION.TOP_CENTER,
        })
        return
    }

    setTrackersSaving(new Map(trackersSaving.set(tracker.id, true)))
    const updTracker = await WalletService.saveTokenTracker(update)
    const trackers = tokTrackers.get(coll)
    const idx = trackers.findIndex( trk => trk.id === tracker.id )
    const newTrks = new Map(tokTrackers.set(coll, [
        ...trackers.slice(0, idx),
        updTracker,
        ...trackers.slice(idx+1, trackers.length)
    ]))
    setTokTrackers(newTrks)
    setTrackersSaving(new Map(trackersSaving.set(tracker.id, false)))
  }

  console.log('tokTrackers', tokTrackers)

  return (
    <Box>
      <Box bg={ useColorModeValue( 'gray.100', 'gray.700' ) }>
        { !userIsActive( user ) &&
            <UnauthorizedHero />
        }
      </Box>

      { walletLoaded && collections.map((coll, i) => {
          const trackers = tokTrackers.get(coll)
          const sumFloor = trackers.reduce((sum, trk) => {
              sum += trk.token?.floorPrice || 0.0
              return sum
          }, 0.0)
          const sumSugg = trackers.reduce((sum, trk) => {
            sum += trk.token?.suggestedPrice || 0.0
            return sum
          }, 0.0)

          return(
            <Box p={4} key={i}>

                {/* Wallet Portfolio */}
                <Flex direction="row" justify={'center'}>
                    <Flex
                        align={'center'}
                        justify={'center'}
                        py={12}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        mr="4"
                    >
                        <Stack
                            boxShadow={'2xl'}
                            bg={useColorModeValue('white', 'gray.700')}
                            rounded={'xl'}
                            p={10}
                            spacing={8}
                            align={'center'}
                        >
                            <Icon as={NotificationIcon} w={24} h={24} />
                            <Stack align={'center'} spacing={2}>
                                <Heading
                                    textTransform={'uppercase'}
                                    fontSize={'3xl'}
                                    color={useColorModeValue('gray.800', 'gray.200')}
                                >
                                    Wallet Tracker
                                </Heading>
                                <Text fontSize={'lg'} color={'gray.500'}>
                                    Alerts when your portfolio changes!
                                </Text>
                            </Stack>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
                                <Input
                                    type={'text'}
                                    placeholder={'wallet address'}
                                    color={useColorModeValue('gray.800', 'gray.200')}
                                    bg={useColorModeValue('gray.100', 'gray.600')}
                                    rounded={'full'}
                                    border={0}
                                    _focus={{
                                        bg: useColorModeValue('gray.200', 'gray.800'),
                                        outline: 'none',
                                    }}
                                    onChange={ e => setNewWalletAddr(e.target.value) }
                                    value={ newWalletAddr }
                                    fontSize="sm"
                                />
                                <Button
                                    bg={'blue.400'}
                                    rounded={'full'}
                                    color={'white'}
                                    flex={'1 0 auto'}
                                    _hover={{ bg: 'blue.500' }}
                                    _focus={{ bg: 'blue.500' }}
                                    onClick={ async () => {
                                        const trackedWallets = [...user.trackedWallets, newWalletAddr]
                                        if ( trackedWallets ) {
                                            const user = await userService.update({ trackedWallets })
                                            setNewWalletAddr("")
                                            dispatch({ type: 'SET_USER', payload: user })
                                            toast.success("Wallets Updated", {
                                            position: toast.POSITION.TOP_CENTER
                                            })
                                        }
                                    }}
                                >
                                    Track
                                </Button>
                            </Stack>

                            <Stack spacingX={4} direction="column" w={'full'}>
                                { user.trackedWallets.map( wallet => (
                                    <Box
                                        bg={useColorModeValue('gray.100', 'gray.600')}
                                        rounded={'full'}
                                        border={0}
                                        py="2"
                                        px="4"
                                        fontSize="sm"
                                        textColor={useColorModeValue('gray.500', 'gray.200')}
                                    >
                                        { wallet }
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Flex>

                    <Flex
                        align={'center'}
                        justify={'center'}
                        py={12}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                    >
                        <Stack
                            boxShadow={'2xl'}
                            bg={useColorModeValue('white', 'gray.700')}
                            rounded={'xl'}
                            p={10}
                            spacing={8}
                            align={'center'}
                        >
                            <Icon as={NotificationIcon} w={24} h={24} />
                            <Stack align={'center'} spacing={2}>
                                <Heading
                                    textTransform={'uppercase'}
                                    fontSize={'3xl'}
                                    color={useColorModeValue('gray.800', 'gray.200')}
                                >
                                    Wallet Tracker
                                </Heading>
                                <Text fontSize={'lg'} color={'gray.500'}>
                                    Alerts when your portfolio changes!
                                </Text>
                            </Stack>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
                                <Input
                                    type={'text'}
                                    placeholder={'wallet address'}
                                    color={useColorModeValue('gray.800', 'gray.200')}
                                    bg={useColorModeValue('gray.100', 'gray.600')}
                                    rounded={'full'}
                                    border={0}
                                    _focus={{
                                        bg: useColorModeValue('gray.200', 'gray.800'),
                                        outline: 'none',
                                    }}
                                    onChange={ e => setNewWalletAddr(e.target.value) }
                                    value={ newWalletAddr }
                                    fontSize="sm"
                                />
                                <Button
                                    bg={'blue.400'}
                                    rounded={'full'}
                                    color={'white'}
                                    flex={'1 0 auto'}
                                    _hover={{ bg: 'blue.500' }}
                                    _focus={{ bg: 'blue.500' }}
                                    onClick={ async () => {
                                        const trackedWallets = [...user.trackedWallets, newWalletAddr]
                                        if ( trackedWallets ) {
                                            const user = await userService.update({ trackedWallets })
                                            setNewWalletAddr("")
                                            dispatch({ type: 'SET_USER', payload: user })
                                            toast.success("Wallets Updated", {
                                            position: toast.POSITION.TOP_CENTER
                                            })
                                        }
                                    }}
                                >
                                    Track
                                </Button>
                            </Stack>

                            <Stack spacingX={4} direction="column" w={'full'}>
                                { user.trackedWallets.map( wallet => (
                                    <Box
                                        bg={useColorModeValue('gray.100', 'gray.600')}
                                        rounded={'full'}
                                        border={0}
                                        py="2"
                                        px="4"
                                        fontSize="sm"
                                        textColor={useColorModeValue('gray.500', 'gray.200')}
                                    >
                                        { wallet }
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Flex>
                </Flex>

                {/* Collection Summary */}
                <Flex
                    w={'full'}
                    backgroundSize={'cover'}
                    backgroundPosition={'center center'}
                    mb="4"
                >
                    <VStack
                        w={'full'}
                        justify={'center'}
                        px={4}
                        py={4}
                        bgGradient={'linear(to-r, navy, transparent)'}
                    >
                        <Heading fontSize="lg" color="white" textDecoration="underline">
                            { coll }
                        </Heading>
                        <SimpleGrid
                            columns={2}
                            spacingX='8'
                            px='2'
                            fontWeight={500}
                            fontSize="sm"
                            color="white"
                        >
                            <Text>Count</Text>
                            <Text>{trackers.length}</Text>
                            <Text>Total Value @ Floor</Text>
                            <Text>{ sumFloor.toFixed( 2 ) } SOL</Text>
                            <Text>Total Value @ Suggested Price</Text>
                            <Text>{ sumSugg.toFixed( 2 ) } SOL</Text>
                        </SimpleGrid>
                    </VStack>
                </Flex>

                {/* Collection Tokens  */}
                <SimpleGrid columns={3} spacing={7}>
                { trackers.slice(0,3).map((tracker, j) => {
                    return(
                        <Stack key={j}
                            borderRadius="md"
                            boxShadow="md"
                            p="2"
                            direction="row"
                        >
                            <Box>
                                <Image
                                    src={ tracker.token?.image }
                                    alt={ `Picture of ${tracker.token?.title}` }
                                    rounded="lg"
                                    w="60"
                                />
                                <Text fontWeight={600}>{tracker.token?.title}</Text>
                            </Box>

                            <Stack>
                                <Flex>
                                    <SimpleGrid
                                        columns={2}
                                        spacingX='8'
                                        px='2'
                                        fontWeight={500}
                                        fontSize="sm"
                                        mb="4"
                                    >
                                        <Text>Suggested Price</Text>
                                        <Text>{tracker.token?.suggestedPrice?.toFixed(2) || "?"} SOL</Text>
                                        <Text>Floor Price</Text>
                                        <Text>{tracker.token?.floorPrice?.toFixed(2) || "?"} SOL</Text>
                                        <Text> Rank </Text>
                                        <Text> #{tracker.token?.rank || "?"} </Text>
                                        <Text>Wallet</Text>
                                        <Text>{ tracker.walletAddress.slice(0,6) }...</Text>
                                    </SimpleGrid>
                                </Flex>

                                <Box px='2'>
                                    <Stack direction="row">
                                        <Box alignItems="end">
                                            <FormLabel htmlFor='alertActive' mb='0' fontWeight={500} fontSize="sm">
                                                { tracker.active ? "Active" : "Inactive" }
                                            </FormLabel>
                                            <Switch
                                                id="alertActive"
                                                isChecked={tracker.active}
                                                onChange={e => updateTracker(
                                                    tracker.token?.collection,
                                                    { ...tracker, active: e.target.checked},
                                                )}
                                            />
                                        </Box>

                                        <Menu>
                                            <MenuButton as={Button}
                                                rightIcon={<AiOutlineDown />}
                                                fontSize="sm"
                                            >
                                                { tracker.tokenTrackerType || "Tracker Type" }
                                            </MenuButton>
                                            <MenuList>
                                                { trackerTypes.map( tokenTrackerType => {
                                                    return(
                                                        <MenuItem key={tokenTrackerType}
                                                            fontSize="sm"
                                                            onClick={() => updateTracker(
                                                                tracker.token?.collection,
                                                                { ...tracker, tokenTrackerType },
                                                            )}
                                                        >
                                                            { tokenTrackerType }
                                                        </MenuItem>
                                                    )
                                                })}
                                            </MenuList>
                                        </Menu>
                                    </Stack>

                                    {/* Above Input */}
                                    <FormControl display='flex' alignItems='center' mt="1">                                    
                                        <FormLabel htmlFor='above'
                                            mb='0'
                                            fontWeight={500}
                                            fontSize="sm"
                                        >
                                            Above
                                        </FormLabel>

                                        <ButtonGroup size='sm' isAttached variant='outline'>
                                            <NumberInput
                                                id="above"
                                                step={1}
                                                precision={2}
                                                defaultValue={tracker?.above || 0.0}
                                                min={0}
                                                size="sm"
                                                disabled={tracker?.above == null}
                                                onChange={aboveStr => {
                                                    const above = parseFloat( aboveStr )
                                                    updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, above },
                                                    )
                                                }}
                                            >
                                                <NumberInputField placeholder={`${tracker?.above || "None"}`}/>
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            { tracker?.above == null ?
                                                <IconButton aria-label='Add Above'
                                                    ml="0.5"
                                                    icon={<IoIosAddCircleOutline/>}
                                                    onClick={() => updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, above: 0.0},
                                                    )}
                                                />
                                                :
                                                <IconButton aria-label='Remove Above'
                                                    ml="0.5"
                                                    icon={<IoMdClose/>}
                                                    onClick={() => updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, above: undefined},
                                                    )}
                                                />
                                            }
                                        </ButtonGroup>
                                    </FormControl>

                                    {/* Below Input */}
                                    <FormControl display='flex' alignItems='center' mt="1">                                    
                                        <FormLabel htmlFor='below'
                                            mb='0'
                                            fontWeight={500}
                                            fontSize="sm"
                                        >
                                            Below
                                        </FormLabel>

                                        <ButtonGroup size='sm' isAttached variant='outline'>
                                            <NumberInput
                                                id="below"
                                                step={1}
                                                precision={2}
                                                defaultValue={tracker?.below || 0.0}
                                                min={0}
                                                size="sm"
                                                disabled={tracker?.below == null}
                                                onChange={belowStr => {
                                                    const below = parseFloat( belowStr )
                                                    updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, below },
                                                    )
                                                }}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            { tracker?.below == null ?
                                                <IconButton aria-label='Remove Below'
                                                    ml="0.5"
                                                    icon={<IoIosAddCircleOutline/>}
                                                    onClick={() => updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, below: 0.0},
                                                    )}
                                                />
                                                :
                                                <IconButton aria-label='Add Below'
                                                    ml="0.5"
                                                    icon={<IoMdClose/>}
                                                    onClick={() => updateTracker(
                                                        tracker.token?.collection,
                                                        { ...tracker, below: undefined},
                                                    )}
                                                />
                                            }
                                        </ButtonGroup>
                                    </FormControl>

                                    <Box mt="4" width="max">
                                        <Button
                                            isLoading={trackersSaving.get(tracker.id)}
                                            loadingText='Saving'
                                            colorScheme="facebook"
                                            variant="solid"
                                            float="right"
                                            onClick={ saveTokenTracker(coll, tracker)}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Box>
                            </Stack>
                        </Stack>
                    )
                })}
                </SimpleGrid>
            </Box>
          )
      })}
    </Box>
  )
}

const NotificationIcon = createIcon({
    displayName: 'Notification',
    viewBox: '0 0 128 128',
    path: (
      <g id="Notification">
        <rect
          className="cls-1"
          x="1"
          y="45"
          fill={'#fbcc88'}
          width="108"
          height="82"
        />
        <circle className="cls-2" fill={'#8cdd79'} cx="105" cy="86" r="22" />
        <rect
          className="cls-3"
          fill={'#f6b756'}
          x="1"
          y="122"
          width="108"
          height="5"
        />
        <path
          className="cls-4"
          fill={'#7ece67'}
          d="M105,108A22,22,0,0,1,83.09,84a22,22,0,0,0,43.82,0A22,22,0,0,1,105,108Z"
        />
        <path
          fill={'#f6b756'}
          className="cls-3"
          d="M109,107.63v4A22,22,0,0,1,83.09,88,22,22,0,0,0,109,107.63Z"
        />
        <path
          className="cls-5"
          fill={'#d6ac90'}
          d="M93,30l16,15L65.91,84.9a16,16,0,0,1-21.82,0L1,45,17,30Z"
        />
        <path
          className="cls-6"
          fill={'#cba07a'}
          d="M109,45,65.91,84.9a16,16,0,0,1-21.82,0L1,45l2.68-2.52c43.4,40.19,41.54,39.08,45.46,40.6A16,16,0,0,0,65.91,79.9l40.41-37.42Z"
        />
        <path
          className="cls-7"
          fill={'#dde1e8'}
          d="M93,1V59.82L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82V1Z"
        />
        <path
          className="cls-8"
          fill={'#c7cdd8'}
          d="M74,56c-3.56-5.94-3-10.65-3-17.55a16.43,16.43,0,0,0-12.34-16,5,5,0,1,0-7.32,0A16,16,0,0,0,39,38c0,7.13.59,12-3,18a3,3,0,0,0,0,6H50.41a5,5,0,1,0,9.18,0H74a3,3,0,0,0,0-6ZM53.2,21.37a3,3,0,1,1,3.6,0,1,1,0,0,0-.42.7,11.48,11.48,0,0,0-2.77,0A1,1,0,0,0,53.2,21.37Z"
        />
        <path
          className="cls-3"
          fill={'#f6b756'}
          d="M46.09,86.73,3,127H1v-1c6-5.62-1.26,1.17,43.7-40.78A1,1,0,0,1,46.09,86.73Z"
        />
        <path
          className="cls-3"
          fill={'#f6b756'}
          d="M109,126v1h-2L63.91,86.73a1,1,0,0,1,1.39-1.49C111,127.85,103.11,120.51,109,126Z"
        />
        <path
          className="cls-8"
          fill={'#c7cdd8'}
          d="M93,54.81v5L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82v-5L44.09,79.9a16,16,0,0,0,21.82,0Z"
        />
        <path
          className="cls-9"
          fill={'#fff'}
          d="M101,95c-.59,0-.08.34-8.72-8.3a1,1,0,0,1,1.44-1.44L101,92.56l15.28-15.28a1,1,0,0,1,1.44,1.44C100.21,96.23,101.6,95,101,95Z"
        />
        <path
          className="cls-3"
          fill={'#f6b756'}
          d="M56.8,18.38a3,3,0,1,0-3.6,0A1,1,0,0,1,52,20,5,5,0,1,1,58,20,1,1,0,0,1,56.8,18.38Z"
        />
        <path
          className="cls-1"
          fill={'#fbcc88'}
          d="M71,42.17V35.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,39,35c0,7.33.58,12-3,18H74A21.06,21.06,0,0,1,71,42.17Z"
        />
        <path
          className="cls-3"
          fill={'#f6b756'}
          d="M74,53H36a21.36,21.36,0,0,0,1.86-4H72.14A21.36,21.36,0,0,0,74,53Z"
        />
        <path className="cls-3" fill={'#f6b756'} d="M59.59,59a5,5,0,1,1-9.18,0" />
        <path
          className="cls-1"
          fill={'#fbcc88'}
          d="M74,59H36a3,3,0,0,1,0-6H74a3,3,0,0,1,0,6Z"
        />
      </g>
    ),
  });