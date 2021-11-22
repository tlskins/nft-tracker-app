import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Heading,
  Text,
  Select,
  Stack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'
import Moment from "moment"

import { globalContext } from '../../store'
import CollectionTrackerDataService from '../../services/collectionTracker.service'
import { ICollectionTracker, IMarketListing, IRarityCalculator } from '../../types/collectionTracker'
import { userIsActive } from '../../types/user'
import MarketListing, { CollapsedMarketListing } from '../../components/marketListing'
import {
  Testimonial,
  RegularContent,
  TestimonialAvatar,
  TestimonialHeading,
  TestimonialContent,
  TestimonialText,
} from '../../components/testimonial'
import UnauthorizedHero from '../../components/UnauthorizedHero'

const getNumChgStr = (num: number, chg: number): string => {
  return `${num.toFixed(2)} (${chg < 0 ? "-" : "+"}${Math.abs(chg).toFixed(0)}%)`;
};

export default function Homepage() {
  const router = useRouter()
  console.log(router.query)
  const { globalState: { user } } = useContext( globalContext )
  const { collectionName } = router.query
  const [ tracker, setTracker ] = useState( undefined as ICollectionTracker | undefined )
  const [ rarityCalculator, setRarityCalculator ] = useState( undefined as IRarityCalculator | undefined )
  const [ expandedListings, setExpandedListings ] = useState( {} as any)
  const [sortBy, setSortBy] = useState("ROI")

  const {
    currentBest,
    marketSummary,
    currentListings,
  } = tracker || {}
  const {
    hourMarketSummary,
    dayMarketSummary,
    weekMarketSummary,
  } = marketSummary || {}
  const {
    listingFloor: currentFloor,
    listingFloorChange: floorChgHour,
  } = hourMarketSummary || {}
  const {
    listingFloor: lastDayFloor,
    listingFloorChange: floorChgDay,
    totalSales,
    totalSalesChange,
    avgSalePrice: averageSalesPrice,
    avgSalePriceChange,
    totalSalesVolume: salesVolume,
  } = dayMarketSummary || {}
  const {
    listingFloor: lastWeekFloor,
    listingFloorChange: floorChgWk,
  } = weekMarketSummary || {}
  const hourlySales = totalSales / 12;

  const loadCollectionData = async (collection: string) => {
    const tracker: ICollectionTracker | undefined = await CollectionTrackerDataService.get( collection ) as ICollectionTracker | undefined
    if ( tracker ) {
      setTracker( tracker )
      if ( tracker.currentListings?.length > 0 ) {
        setExpandedListings( { ...expandedListings, [tracker.currentListings[0].id]: true } )
      }
    }
  }

  const loadRarityData = async (collection: string) => {
    const calc: IRarityCalculator | undefined = await CollectionTrackerDataService.getRarity( collection ) as IRarityCalculator | undefined
    if ( calc ) {
      setRarityCalculator( calc  )
    }
  }

  useEffect(() => {
    if ( collectionName && user ) {
      loadCollectionData(collectionName as string ).catch( err => console.log( err ))
      loadRarityData(collectionName as string ).catch( err => console.log( err ))
    }
  }, [collectionName, user])

  const sortListings = (sortBy: string) => (a: IMarketListing, b: IMarketListing): number => {
    if ( sortBy === "ROI" ) {
      return b.score - a.score
    } else if ( sortBy === "Rank" ) {
      return a.rank - b.rank
    } else if ( sortBy === "Min Price" ) {
      return a.price - b.price
    }
    return 0
  }

  useEffect(() => {
    if ( sortBy && tracker ) {
      const sortedTracker = {
        ...tracker,
        currentListings: tracker.currentListings.sort(sortListings(sortBy))
      }
      setExpandedListings({})
      setTracker(sortedTracker)
    }
  }, [sortBy])

  console.log( 'tracker', sortBy, tracker )

  return (
    <Box>
      <Box bg={ useColorModeValue( 'gray.100', 'gray.700' ) }>
        { !userIsActive(user) &&
          <UnauthorizedHero />
        }
        { tracker &&
          <Container maxW={ '7xl' } py={ 16 } as={ Stack } spacing={ 12 }>
            <Stack spacing={ 0 } align={ 'center' }>
              <Heading>{ tracker?.collection }</Heading>
              <Text fontSize="sm">last updated { Moment( tracker.lastUpdated).format("LLL") }</Text>
            </Stack>

            <Stack
              direction={ { base: 'column', md: 'row' } }
              justify="center"
              justifyContent="center"
              spacing={ { base: 10, md: 4, lg: 10 } }
            >

              <Testimonial>
                <RegularContent>
                  <TestimonialHeading>
                    Floors
                  </TestimonialHeading>
                  <TestimonialText>
                    <Container w="100%">
                      Current { getNumChgStr(currentFloor, floorChgHour) }<br />
                      Last Day Avg { getNumChgStr(lastDayFloor, floorChgDay) }<br />
                      Last Week Avg { getNumChgStr(lastWeekFloor, floorChgWk) }<br />
                    </Container>
                  </TestimonialText>
                </RegularContent>
              </Testimonial>

              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>
                    Best
                  </TestimonialHeading>
                  <TestimonialText>
                    <Container w="100%">
                      { currentBest.title } <br />
                      { currentBest.rarity } @ { currentBest.price.toFixed( 2 ) }<br />
                    ROI: { (currentBest.score * 100).toFixed( 1 ) }% |
                    Suggested Price: { currentBest.suggestedPrice?.toFixed( 2 ) || "?" }<br />
                    </Container>
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={ currentBest.image }
                  name={ currentBest.title }
                  title={ currentBest.rarity }
                />
              </Testimonial>

              <Testimonial>
                <RegularContent>
                  <TestimonialHeading>
                    Volume
                  </TestimonialHeading>
                  <TestimonialText>
                    <Container w="100%">
                      Hourly Sales: { getNumChgStr(totalSales, totalSalesChange) }<br />
                      Current Avg Sale: { getNumChgStr(averageSalesPrice, avgSalePriceChange) }<br />
                      <br />
                    </Container>
                  </TestimonialText>
                </RegularContent>
              </Testimonial>

            </Stack>
          </Container>
        }
      </Box>

      <Stack border="red" direction="row" maxWidth="md" marginTop="2" marginX="auto" py="4">
        <Select
          placeholder=" - Sort Listings By - "
          backgroundColor="teal"
          color="white"
          boxShadow="md"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="wider"
          onChange={ e => setSortBy(e.target.value)}
        >
          <option value="ROI">ROI</option>
          <option value="Rank">Rank</option>
          <option value="Min Price">Min Price</option>
        </Select>
      </Stack>

      <Box bg={ useColorModeValue( 'white.100', 'gray.700' ) }>

        { currentListings?.map(( listing, i ) => {
          const currentRank = i + 1
          return(
            expandedListings[listing.id] ?
            <MarketListing
              key={ listing.id }
              listing={ listing }
              rarityCalculator={ rarityCalculator }
              currentRank={ currentRank }
              onClick={ () => setExpandedListings({ ...expandedListings, [listing.id]: false })}
            />
            :
            <CollapsedMarketListing
              key={ listing.id }
              listing={ listing }
              currentRank={ currentRank }
              onClick={ () => setExpandedListings({ ...expandedListings, [listing.id]: true })}
            />
          )
        })}
      </Box>
    </Box>
  )
}
