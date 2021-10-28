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
    floorPrice: currentFloor,
    lastDayFloor,
    lastWeekFloor,
    hourlySales,
    averageSalesPrice,
    salesVolume,
    currentListings,
  } = tracker || {}

  const loadCollectionData = async (collection: string) => {
    const resp: ICollectionResponse = await CollectionTrackerDataService.get( collection ) as ICollectionResponse
    if ( resp?.data ) {
      setTracker( resp.data.tracker )
      setRarityCalculator( resp.data.rarityCalculator  )
      if ( resp.data.tracker.currentListings?.length > 0 ) {
        setExpandedListings( { ...expandedListings, [resp.data.tracker.currentListings[0].id]: true } )
      }
    }
  }

  useEffect(() => {
    if ( collectionName ) {
      loadCollectionData(collectionName as string ).catch( err => console.log( err ))
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
                      Current { currentFloor.floorPrice } { currentFloor.percentChange && `(${currentFloor.percentChange.toFixed( 2 )}%)` }<br />
                      Last Day Avg { lastDayFloor.floorPrice } { lastDayFloor.percentChange && `(${lastDayFloor.percentChange.toFixed( 2 )}%)` }<br />
                      Last Week Avg { lastWeekFloor.floorPrice }<br />
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
