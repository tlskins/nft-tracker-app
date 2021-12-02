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
import walletService from '../../services/wallet.service'
import Moment from 'moment'


export default function WalletManager() {
  const { globalState: { user }, dispatch } = useContext( globalContext )

  // mgmt
  const [ walletLoaded, setWalletLoaded ] = useState( false )
  const [ trackerTypes, setTrackerTypes ] = useState([] as string[])
  const [ trackersSaving, setTrackersSaving ] = useState(new Map() as Map<string, boolean>)
  const [ newWalletAddr, setNewWalletAddr ] = useState("")
  const [ isSyncWallet, setIsSyncWallet ] = useState(false)

  // trackers
  const [ allTrackers, setAllTrackers ] = useState([] as ITokenTracker[])
  const [ tokTrksMap, setTokTrksMap ] = useState(new Map() as Map<string, ITokenTracker[]>)
  const [ untrackedNfts, setUntrackedNfts ] = useState([] as Nft[])
  const [ collections, setCollections ] = useState([] as string[])
  const [ selCollection, setSelCollection ] = useState("")
  const selTrackers = tokTrksMap.get(selCollection) || []
  const selFloorSum = selTrackers.reduce((sum, trk) => {
    sum += trk.token?.floorPrice || 0.0
    return sum
  }, 0.0)
  const sellSuggSum = selTrackers.reduce((sum, trk) => {
    sum += trk.token?.suggestedPrice || 0.0
    return sum
  }, 0.0)

  // portfolio
  const [ selWallet, setSelWallet ] = useState("")
  const [ ttlTracked, setTtlTracked ] = useState(0)
  const [ ttlUntracked, setTtlUntracked ] = useState(0)
  const [ ttlFloor, setTtlFloor ] = useState(0)
  const [ ttlSugg, setTtlSugg ] = useState(0)
  const [ mostVal, setMostVal ] = useState(undefined as ITokenTracker | undefined)

  useEffect(() => {
    if ( !walletLoaded && user && userIsActive( user ) ) {
        getWallet()
    }
    if ( user && user.trackedWallets?.length > 0 ) {
        setSelWallet(user.trackedWallets[0])
    }
  }, [ user ])

  useEffect(() => {
    const walletTrks = allTrackers.filter( trk => trk.walletAddress === selWallet )
    let mostVal = undefined as ITokenTracker | undefined
    walletTrks.forEach( trk => {
        if ( mostVal === undefined || trk.token?.suggestedPrice > mostVal.token?.suggestedPrice ) {
            mostVal = trk
        }
    })
    setMostVal( mostVal )
    setTtlFloor( walletTrks.reduce((sum, trk) => {
        sum += trk.token?.floorPrice || 0.0
        return sum
    }, 0.0) )
    setTtlSugg( walletTrks.reduce((sum, trk) => {
        sum += trk.token?.suggestedPrice || 0.0
        return sum
    }, 0.0) )
    setTtlTracked( walletTrks.length )
    setTtlUntracked( untrackedNfts.filter( nft => nft.walletAddress === selWallet ).length )
  }, [ selWallet, allTrackers ])

  const getWallet = async (): Promise<void> => {
    const walletResp = await WalletService.getWallet()
    if ( walletResp ) {
        loadWallet( walletResp.tracked, walletResp.untracked )
        setTrackerTypes( walletResp.tokenTrackingTypes )
    }
  }

  const onTrackWalletAddr = async (): Promise<void> => {
    const trackedWallets = [...user.trackedWallets, newWalletAddr]
    if ( trackedWallets ) {
        const user = await userService.update({ trackedWallets })
        setNewWalletAddr("")
        dispatch({ type: 'SET_USER', payload: user })
        toast.success("Wallets Updated", {
            position: toast.POSITION.TOP_CENTER
        })
    }
  }

  const onRemoveWalletAddr = (walletAddr: string) => async (): Promise<void> => {
    const updUser = await walletService.deleteWallet(walletAddr)

    if ( updUser ) {
        setNewWalletAddr("")
        dispatch({ type: 'SET_USER', payload: updUser })
        toast.success("Wallets Updated", {
            position: toast.POSITION.TOP_CENTER
        })
        getWallet()
    }
  }

  const onSyncWallet = async (): Promise<void> => {
    setIsSyncWallet( true )
    const resp = await walletService.syncWallet()
    if ( resp ) {
        loadWallet( resp.tracked, resp.untracked )
    }
    setIsSyncWallet( false )
  }

  const loadWallet = (tracked: ITokenTracker[], untracked: Nft[]) => {
    const allTrackers = [] as ITokenTracker[]
    const collections = []
    const tokTrksMap = new Map<string, ITokenTracker[]>();
    const procTrksMap = new Map<string, ITokenTracker[]>();
    const cutoff = Moment().add(-2, "hour")
    tracked.forEach( tracker => {
        const coll = tracker.token?.collection
        if ( !tokTrksMap.get(coll) ) {
            tokTrksMap.set(coll, [])
            collections.push(coll)
        }
        const updTrackers = tokTrksMap.get(coll)
        tokTrksMap.set(coll, [...updTrackers, tracker])
        if ( !tracker.token?.lastCalcAt || Moment(tracker.token?.lastCalcAt).isBefore(cutoff)) {
            const procTrks = procTrksMap.get(coll)
            procTrksMap.set(coll, [...(procTrks || []), tracker])    
        }
        allTrackers.push(tracker)
    })

    setAllTrackers( allTrackers )
    setCollections( collections )
    setSelCollection( collections.length > 0 ? collections[0] : "" )
    setTokTrksMap( tokTrksMap )
    setUntrackedNfts( untracked )
    setWalletLoaded( true )
    predictTrackers( procTrksMap, allTrackers, tokTrksMap )
  }

  const predictTrackers = async (
      procTrksMap: Map<string, ITokenTracker[]>,
      allTrackers: ITokenTracker[],
      tokTrksMap: Map<string, ITokenTracker[]>,
    ): Promise<void> => {
    let newAllTrackers = [...allTrackers]
    let newTokTrksMap = new Map(tokTrksMap)
    for (const coll of Array.from(procTrksMap.keys())) {
        const trackers = procTrksMap.get(coll)
        const updTrks = await walletService.predictTokenTracker({ collection: coll, ids: trackers.map( t => t.id )})
        if ( updTrks ) {
            updTrks.forEach( trk => {
                console.log('tracker', trk.id)
                // update in all trackers
                const allIdx = allTrackers.findIndex( t => t.id === trk.id )
                console.log('alltrackers', allIdx)
                newAllTrackers = [
                    ...allTrackers.slice(0, allIdx),
                    trk,
                    ...allTrackers.slice(allIdx+1, allTrackers.length)
                ]

                // update in trackers map
                let collTrks = procTrksMap.get(coll)
                const collTrksIdx = collTrks.findIndex( t => t.id === trk.id )
                console.log('collTrks', allIdx)
                collTrks = [
                    ...collTrks.slice(0, collTrksIdx),
                    trk,
                    ...collTrks.slice(collTrksIdx+1, allTrackers.length)
                ]
                newTokTrksMap.set(coll, collTrks)
            })
        }
    }
    setAllTrackers( newAllTrackers )
    setTokTrksMap( new Map(newTokTrksMap) )
  }

  const updateTracker = (coll: string, tracker: ITokenTracker) => {
    const trackers = tokTrksMap.get(coll)
    const idx = trackers.findIndex( trk => trk.id === tracker.id )
    const newTrks = new Map(tokTrksMap.set(coll, [
        ...trackers.slice(0, idx),
        {...tracker},
        ...trackers.slice(idx+1, trackers.length)
    ]))
    setTokTrksMap(newTrks)
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
    const trackers = tokTrksMap.get(coll)
    const idx = trackers.findIndex( trk => trk.id === tracker.id )
    const newTrks = new Map(tokTrksMap.set(coll, [
        ...trackers.slice(0, idx),
        updTracker,
        ...trackers.slice(idx+1, trackers.length)
    ]))
    setTokTrksMap(newTrks)
    setTrackersSaving(new Map(trackersSaving.set(tracker.id, false)))
  }

  return (
    <Box>
      <Box bg={ useColorModeValue( 'gray.100', 'gray.700' ) }>
        { !userIsActive( user ) &&
            <UnauthorizedHero />
        }
      </Box>

      { (walletLoaded && user) &&
            <Box p={4}>
                <Flex direction="row" justify={'center'}>
                    {/* Wallets Manager */}
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
                                    placeholder={'Wallet Address'}
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
                                    onClick={ onTrackWalletAddr }
                                >
                                    Track
                                </Button>
                            </Stack>

                            <Stack spacingX={4} direction="column" w={'full'}>
                                { user.trackedWallets.map( wallet => (
                                    <Box
                                        rounded={'full'}
                                        border={0}
                                        py="2"
                                        px="4"
                                        fontSize="sm"
                                        cursor="pointer"
                                        bg={ selWallet === wallet ? 'blue.600' : useColorModeValue('gray.100', 'gray.600')}
                                        textColor={ selWallet === wallet ? 'white' : useColorModeValue('gray.500', 'gray.200')}
                                        _hover={{ bg: 'blue.500', color: 'white' }}
                                        _focus={{ bg: 'blue.500', color: 'white' }}
                                        onClick={() => setSelWallet(wallet)}
                                    >
                                        { wallet }
                                    </Box>
                                ))}
                            </Stack>

                            { user.trackedWallets.length > 0 &&
                                <Button
                                    bg={'blue.400'}
                                    rounded={'full'}
                                    color={'white'}
                                    flex={'1 0 auto'}
                                    isLoading={ isSyncWallet }
                                    _hover={{ bg: 'green.500' }}
                                    _focus={{ bg: 'green.500' }}
                                    onClick={ onSyncWallet }
                                >
                                    Sync Wallets
                                </Button>
                            }
                        </Stack>
                    </Flex>

                    {/* Wallet Portfolio */}
                    { selWallet !== "" &&
                        <Flex
                            align={'center'}
                            justify={'center'}
                            py={12}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                        >
                            <Stack
                                height="full"
                                boxShadow={'2xl'}
                                bg={useColorModeValue('white', 'gray.700')}
                                rounded={'xl'}
                                p={10}
                                spacing={8}
                                align={'center'}
                                alignContent="center"
                                verticalAlign="center"
                            >
                                <Box alignSelf="center">
                                    <Stack align={'center'} spacing={2} mb="4">
                                        <Heading
                                            textTransform={'uppercase'}
                                            fontSize={'3xl'}
                                            color={useColorModeValue('gray.800', 'gray.200')}
                                        >
                                            Portfolio
                                        </Heading>
                                        <Text fontSize={'lg'} color={'gray.500'}>
                                            { selWallet.slice(0,6) }...{ selWallet.slice(-6) }
                                        </Text>
                                        <Button
                                            size="xs"
                                            bg={'orange.400'}
                                            rounded={'full'}
                                            color={'white'}
                                            flex={'1 0 auto'}
                                            _hover={{ bg: 'red.500' }}
                                            _focus={{ bg: 'red.500' }}
                                            onClick={onRemoveWalletAddr( selWallet )}
                                        >
                                            Untrack Wallet
                                        </Button>
                                    </Stack>

                                    <SimpleGrid
                                        columns={2}
                                        spacingX='8'
                                        px='2'
                                        fontWeight={500}
                                        fontSize="sm"
                                    >
                                        <Text>Total Tracked</Text>
                                        <Text>{ ttlTracked }</Text>
                                        <Text>Total Untracked</Text>
                                        <Text>{ ttlUntracked }</Text>
                                        <Text>Total Portfolio @ Suggested</Text>
                                        <Text>{ ttlSugg.toFixed( 2 ) } SOL</Text>
                                        <Text>Total Portfolio @ Floor</Text>
                                        <Text>{ ttlFloor.toFixed( 2 ) } SOL</Text>
                                    </SimpleGrid>

                                    { mostVal &&
                                        <Stack
                                            direction="row"
                                            mt="4"
                                            p="2"
                                            borderRadius="md"
                                            boxShadow="md"
                                        >
                                            <Image
                                                src={ mostVal.token?.image }
                                                alt={ `Picture of ${mostVal.token?.title}` }
                                                rounded="lg"
                                                w="60"
                                            />
                                            <Box fontWeight={300} fontSize="sm" py="4">
                                                <Text fontWeight={600}>
                                                    Wallet MVP
                                                </Text>
                                                <Text>
                                                    {mostVal.token?.title}
                                                </Text>
                                                <Text>
                                                    Suggested Price {mostVal.token?.suggestedPrice?.toFixed( 2 ) || "?"} SOL
                                                </Text>
                                                <Text>
                                                    Floor Price {mostVal.token?.floorPrice?.toFixed( 2 ) || "?"} SOL
                                                </Text>
                                            </Box>
                                        </Stack>
                                    }
                                </Box>
                            </Stack>
                        </Flex>
                    }
                </Flex>

                {/* Collection Summary */}
                { selCollection &&
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
                            bgGradient={'linear(to-r, blue.500, transparent)'}
                        >
                            <Menu>
                                <MenuButton as={Button}
                                    rightIcon={<AiOutlineDown />}
                                    fontSize="sm"
                                    mb="4"
                                >
                                    { selCollection }
                                </MenuButton>
                                <MenuList>
                                    { collections.map( coll => {
                                        return(
                                            <MenuItem key={coll}
                                                fontSize="sm"
                                                onClick={() => setSelCollection(coll)}
                                            >
                                                { coll }
                                            </MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </Menu>

                            <SimpleGrid
                                columns={2}
                                spacingX='8'
                                px='2'
                                fontWeight={500}
                                fontSize="sm"
                                color="white"
                            >
                                <Text>Count</Text>
                                <Text>{selTrackers.length}</Text>
                                <Text>Active Alerts</Text>
                                <Text>{selTrackers.filter( alert => alert.active ).length}</Text>
                                <Text>Total Value @ Floor</Text>
                                <Text>{ selFloorSum.toFixed( 2 ) } SOL</Text>
                                <Text>Total Value @ Suggested Price</Text>
                                <Text>{ sellSuggSum.toFixed( 2 ) } SOL</Text>
                            </SimpleGrid>
                        </VStack>
                    </Flex>
                }


                {/* Collection Tokens  */}
                <SimpleGrid columns={3} spacing={7}>
                    { selTrackers.filter( trk => trk.token?.collection === selCollection)
                        .sort((a, b) => b.token?.suggestedPrice - a.token?.suggestedPrice )
                        .map((tracker, j) => {
                            return(
                                <Stack key={tracker.id}
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
                                                <Text> Updated </Text>
                                                <Text> { tracker.token?.lastCalcAt ? Moment( tracker.token?.lastCalcAt ).format('lll') : "Never" } </Text>
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
                                                    onClick={ saveTokenTracker(selCollection, tracker)}
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
        }
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