import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'
import Moment from "moment"
import CollectionTrackerDataService from '../../services/collectionTracker.service'
import { ICollectionResponse, ICollectionTracker, IRarityCalculator } from '../../types/collectionTracker'
import MarketListing, { CollapsedMarketListing } from '../../components/marketListing'
import {
  Testimonial,
  RegularContent,
  TestimonialAvatar,
  TestimonialHeading,
  TestimonialContent,
  TestimonialText,
} from '../../components/testimonial'

export default function Homepage() {
  const router = useRouter()
  console.log(router.query)
  const { collectionName } = router.query
  const [ tracker, setTracker ] = useState( undefined as ICollectionTracker | undefined )
  const [ rarityCalculator, setRarityCalculator ] = useState( undefined as IRarityCalculator | undefined )
  const [ expandedListings, setExpandedListings ] = useState( {} as any)
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
    avgSalePrice: averageSalesPrice,
    totalSalesVolume: salesVolume,
  } = dayMarketSummary || {}
  const { listingFloor: lastWeekFloor } = weekMarketSummary || {}
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
    if ( collectionName ) {
      loadCollectionData(collectionName as string ).catch( err => console.log( err ))
      loadRarityData(collectionName as string ).catch( err => console.log( err ))
    }
  }, [collectionName])

  console.log( 'tracker', tracker )

  return (
    <Box>
      <Box bg={ useColorModeValue( 'gray.100', 'gray.700' ) }>
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
                      Current { currentFloor } { floorChgHour && `(${floorChgHour.toFixed( 2 )}%)` }<br />
                      Last Day Avg { lastDayFloor } { floorChgDay && `(${floorChgDay.toFixed( 2 )}%)` }<br />
                      Last Week Avg { lastWeekFloor }<br />
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
                    Score: { currentBest.score.toFixed( 2 ) } |
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
                      Hourly Sales: { hourlySales?.toFixed( 2 ) || 'N/A' }<br />
                      Last Week Avg { averageSalesPrice?.toFixed( 2 ) || 'N/A' }<br />
                      { salesVolume &&
                        <>
                          Sales Volume { salesVolume.toFixed( 2 ) || 'N/A' }<br />
                        </>
                      }
                      <br />
                    </Container>
                  </TestimonialText>
                </RegularContent>
              </Testimonial>

            </Stack>
          </Container>
        }
      </Box>

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
