import { ReactNode, useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'
import Moment from "moment"
import CollectionTrackerDataService from '../services/collectionTracker.service'
import { ICollectionResponse, ICollectionTracker, IRarityCalculator } from '../types/collectionTracker'
import MarketListing, { CollapsedMarketListing } from '../components/marketListing'

const Testimonial = ({ children }: { children: ReactNode }) => {
  return <Box>{children}</Box>
}

const TestimonialContent = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      bg={ useColorModeValue( 'white', 'gray.800' ) }
      boxShadow={ 'lg' }
      p={ 8 }
      rounded={ 'xl' }
      align={ 'center' }
      pos={ 'relative' }
      _after={ {
        content: '""',
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue( 'white', 'gray.800' ),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      } }
    >
      {children}
    </Stack>
  )
}

const RegularContent = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      bg={ useColorModeValue( 'white', 'gray.800' ) }
      boxShadow={ 'lg' }
      p={ 8 }
      rounded={ 'xl' }
      align={ 'center' }
      pos={ 'relative' }
    >
      {children}
    </Stack>
  )
}

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <Heading as={ 'h3' } fontSize={ 'xl' }>
      {children}
    </Heading>
  )
}

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      textAlign={ 'center' }
      color={ useColorModeValue( 'gray.600', 'gray.400' ) }
      fontSize={ 'sm' }
    >
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string;
  name: string;
  title: string;
}) => {
  return (
    <Flex align={ 'center' } mt={ 8 } direction={ 'column' }>
      <Avatar src={ src } alt={ name } mb={ 2 } size="2xl" />
      <Stack spacing={ -1 } align={ 'center' }>
        <Text fontWeight={ 600 }>{name}</Text>
        <Text fontSize={ 'sm' } color={ useColorModeValue( 'gray.600', 'gray.400' ) }>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export default function Homepage() {
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
    currentListings,
  } = tracker || {}

  const loadCollectionData = async () => {
    const resp: ICollectionResponse = await CollectionTrackerDataService.get( 'jungle-cats' ) as ICollectionResponse
    if ( resp?.data ) {
      setTracker( resp.data.tracker )
      setRarityCalculator( resp.data.rarityCalculator  )
      if ( resp.data.tracker.currentListings?.length > 0 ) {
        setExpandedListings( { ...expandedListings, [resp.data.tracker.currentListings[0].id]: true } )
      }
    }
  }

  useEffect(() => {
    loadCollectionData().catch( err => console.log( err ))
  }, [])

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
                    Suggested Price: { currentBest.suggestedPrice.toFixed( 2 ) }<br />
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
