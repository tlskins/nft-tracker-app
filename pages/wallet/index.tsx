import { useState, useEffect, useContext } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Text,
  Select,
  Stack,
  Switch,
  Container,
  useColorModeValue,
  SimpleGrid,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'
import { IoIosAddCircleOutline } from 'react-icons/io'

import { userIsActive } from '../../types/user'
import { ITokenTracker, Nft } from '../../types/tokens'
import UnauthorizedHero from '../../components/UnauthorizedHero'
import { globalContext } from '../../store'
import WalletService from '../../services/wallet.service'


export default function WalletManager() {
  const { globalState: { user }} = useContext( globalContext )
  const [ walletLoaded, setWalletLoaded ] = useState( false )
  const [ tokTrackers, setTokTrackers ] = useState(new Map() as Map<string, ITokenTracker[]>)
  const [ untrackedNfts, setUntrackedNfts ] = useState([] as Nft[])
  const [ trackerTypes, setTrackerTypes ] = useState([] as string[])
  const [ collections, setCollections ] = useState([] as string[])
  const [ trackersSaving, setTrackersSaving ] = useState(new Map() as Map<string, boolean>)

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
          return(
            <Box p={4} key={i}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={7}>
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
                                <FormControl display='flex' alignItems='center'>
                                    <FormLabel htmlFor='alertActive' mb='0' fontWeight={500} fontSize="sm">
                                        Alert { tracker.active ? "Active" : "Inactive" }
                                    </FormLabel>
                                    <Switch
                                        id="alertActive"
                                        isChecked={tracker.active}
                                        onChange={e => updateTracker(
                                            tracker.token?.collection,
                                            { ...tracker, active: e.target.checked},
                                        )}
                                    />
                                </FormControl>

                                <FormControl display='flex' alignItems='center'>
                                    <Select placeholder='Tracker Type'
                                        variant="flushed"
                                        fontWeight={500}
                                        fontSize="sm"
                                        onChange={e => updateTracker(
                                            tracker.token?.collection,
                                            { ...tracker, tokenTrackerType: e.target.value},
                                        )}
                                    >
                                        { trackerTypes.map( trkType => <option value={trkType}> { trkType } </option>) }
                                    </Select>
                                </FormControl>

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
