import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  Stack,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'
import { IMarketListing, ITokenAttribute, IRarityCalculator, IRarityValuation } from '../types/collectionTracker'
import Moment from 'moment'

  interface RatingProps {
    type: string;
    scoreRank: number | undefined;
  }

function Rating({ scoreRank, type }: RatingProps ) {
  const maxRk = 20
  const scoreRankVal = scoreRank || maxRk
  const scoreRating = scoreRankVal > maxRk ? 0 : (( maxRk - scoreRankVal - 1 ) / maxRk ) * 5

  return (
    <Box d="flex" alignItems="center">
      {Array( 5 )
        .fill( '' )
        .map(( _, i ) => {
          const roundedRating = Math.round( scoreRating * 2 ) / 2
          if ( roundedRating - i >= 1 ) {
            return (
              <BsStarFill
                key={ i }
                style={ { marginLeft: '1' } }
                color={ i < scoreRating ? 'teal.500' : 'gray.300' }
              />
            )
          }
          if ( roundedRating - i === 0.5 ) {
            return <BsStarHalf key={ i } style={ { marginLeft: '1' } } />
          }

          return <BsStar key={ i } style={ { marginLeft: '1' } } />
        })}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
          #{ scoreRank } { type }
      </Box>
    </Box>
  )
}

interface StatsCardProps {
  title: string;
  stat: string;
}

function StatsCard({ title, stat }: StatsCardProps ) {
  return (
    <Stat
      px={ { base: 3, md: 6 } }
      py={ '3' }
      shadow={ 'xl' }
      border={ '1px solid' }
      borderColor={ useColorModeValue( 'gray.800', 'gray.500' ) }
      rounded={ 'lg' }
    >
      <StatLabel fontWeight={ 'medium' } isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={ 'xl' } fontWeight={ 'medium' }>
        {stat}
      </StatNumber>
    </Stat>
  )
}

function SmallStatsCard({ title, stat }: StatsCardProps ) {
  return (
    <Stat
      px={ { base: 2, md: 6 } }
      py={ '1' }
      shadow={ 'xl' }
      border={ '1px solid' }
      borderColor={ useColorModeValue( 'gray.800', 'gray.500' ) }
      rounded={ 'lg' }
    >
      <StatLabel fontWeight={ 'medium' } isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={ 'l' } fontWeight={ 'medium' }>
        {stat}
      </StatNumber>
    </Stat>
  )
}

function MarketListingHighlights({ listing, currentRank }: { listing: IMarketListing, currentRank: number }) {
  return(
    <SimpleGrid columns={ { base: 1, md: 6 } } spacing={ { base: 2, lg: 3 } }>
      <SmallStatsCard
        title="Current Rank"
        stat={ `#${ currentRank }` }
      />
      <SmallStatsCard
        title="Rarity"
        stat={ listing.rarity }
      />
      <SmallStatsCard
        title="Marketplace"
        stat={ listing.marketplace }
      />
      <SmallStatsCard
        title="Suggested Price"
        stat={ `${listing.suggestedPrice?.toFixed( 2 ) || '?'}` }
      />
      <SmallStatsCard
        title="Score"
        stat={ `${listing.score.toFixed( 2 )}` }
      />
      { listing.rank &&
        <SmallStatsCard
          title="Rank"
          stat={ `#${listing.rank}` }
        />
      }
    </SimpleGrid>
  )
}

interface IAttributeRariyProps {
  tokenAttribute: ITokenAttribute;
  rarityCalculator: IRarityCalculator;
}

function AttributeRarity({ tokenAttribute, rarityCalculator }: IAttributeRariyProps ) {
  const rarityValuation: IRarityValuation | undefined = rarityCalculator?.lookup[tokenAttribute.name][tokenAttribute.value] as IRarityValuation | undefined
  const { rarityValue } = rarityValuation

  return (
    <Box
      maxW={ '90%' }
      w={ 'full' }
      bg={ useColorModeValue( 'white', 'gray.900' ) }
      boxShadow={ '2xl' }
      rounded={ 'md' }
      p={ 3 }
      m={ 1 }
      overflow={ 'hidden' }
    >
      <Stack>
        <Text
          color={ 'green.500' }
          textTransform={ 'uppercase' }
          fontWeight={ 800 }
          fontSize={ 'sm' }
          letterSpacing={ 1.1 }
        >
          { tokenAttribute.name }
        </Text>

        { rarityValue &&
          <Text
            textTransform={ 'uppercase' }
            fontWeight={ 800 }
            fontSize={ 'xs' }
            letterSpacing={ 0.7 }
            pl="2"
          >
            <SimpleGrid columns={ 2 } spacing={ 0 }>
              <Text> Suggested Price </Text> <Text> { rarityValue.suggestedPrice?.toFixed( 2 ) || '?' } SOL </Text>
              <Text> Rarity </Text> <Text> { rarityValue.rarity || '?' } </Text>
              <Text> Total Daily Sales </Text> <Text> { rarityValue.totalDailySales } </Text>
              { rarityValue.totalDailySales !== 0 &&
                <>
                  <Text> Avg Sale Price </Text> <Text> { rarityValue.avgSalePrice  } </Text>
                  <Text> Total Daily Volume </Text> <Text> { rarityValue.totalDailyVolume  } </Text>
                </>
              }
            </SimpleGrid>
          </Text>
        }
      </Stack>

      <Tooltip
        label="Recent sales with the same top attribute"
        bg="white"
        placement={ 'top' }
        color={ 'gray.800' }
        fontSize={ 'xs' }
        textAlign="center"
      >
        <Heading
          color={ useColorModeValue( 'gray.700', 'white' ) }
          fontSize={ 'xl' }
          fontFamily={ 'body' }
          mt="5"
        >
          Sales
        </Heading>
      </Tooltip>
      { ( rarityValue?.salesHistory || []).length === 0 &&
          <Text
            textTransform={ 'uppercase' }
            fontWeight={ 800 }
            fontSize={ 'sm' }
            letterSpacing={ 0.7 }
            pl={ 2 }
          >
            None
          </Text>
      }
      { rarityValue?.salesHistory.map( sale => {
        return(
          <Grid
            columns={ 4 }
            templateColumns="repeat(4, 1fr)"
            mt={ 1 }
            direction={ 'row' }
            spacing={ 4 }
            align={ 'left' }
            key={ sale.id }
            pl={ 2 }
          >
            <GridItem colSpan={ 1 } alignContent="center">
              <Text fontWeight={ 600 } fontSize="sm">{ sale.price } SOL</Text>
            </GridItem>

            <GridItem colSpan={ 3 }>
              <Stack direction={ 'column' } spacing={ 0 } fontSize={ 'xs' } align="left">
                <Text fontWeight={ 600 }>{ sale.name }</Text>
                <Text color={ 'gray.500' }> { Moment( sale.date ).format( 'LLL' ) } </Text>

                { sale.attributes.sort(( a, b ) => a.score - b.score ).map( attr => {
                  <SimpleGrid columns={ 3 } spacing={ 1 }>
                    <Text color={ 'gray.500' }> { attr.value } </Text>
                    <Text color={ 'gray.500' }> { attr.rarity } </Text>
                    <Text color={ 'gray.500' }> { attr.score.toFixed( 2 ) } </Text>
                  </SimpleGrid>
                })}
              </Stack>
            </GridItem>
          </Grid>
        )
      })}

      <Tooltip
        label="Current listings with the same top attribute"
        bg="white"
        placement={ 'top' }
        color={ 'gray.800' }
        fontSize={ 'xs' }
        textAlign="center"
      >
        <Heading
          color={ useColorModeValue( 'gray.700', 'white' ) }
          fontSize={ 'xl' }
          fontFamily={ 'body' }
          mt="5"
        >
          Current Listings
        </Heading>
      </Tooltip>
      { ( rarityValue?.currentListings || []).length === 0 &&
          <Text
            textTransform={ 'uppercase' }
            fontWeight={ 800 }
            fontSize={ 'sm' }
            letterSpacing={ 0.7 }
            pl={ 2 }
          >
            None
          </Text>
      }
      { rarityValue?.currentListings.map(( sale, i ) => {
        return(
          <Grid
            key={ i }
            columns={ 4 }
            templateColumns="repeat(4, 1fr)"
            mt={ 1 }
            direction={ 'row' }
            spacing={ 4 }
            align={ 'left' }
            pl={ 2 }
          >
            <GridItem colSpan={ 1 } alignContent="center">
              <Text fontWeight={ 600 } fontSize="sm">{ sale.price } SOL</Text>
            </GridItem>

            <GridItem colSpan={ 3 }>
              <Stack direction={ 'column' } spacing={ 0 } fontSize={ 'xs' } align="left">
                <Text fontWeight={ 600 }>{ sale.name }</Text>

                { sale.attributes.sort(( a, b ) => a.score - b.score ).map( attr => {
                  <SimpleGrid columns={ 3 } spacing={ 1 }>
                    <Text color={ 'gray.500' }> { attr.value } </Text>
                    <Text color={ 'gray.500' }> { attr.rarity } </Text>
                    <Text color={ 'gray.500' }> { attr.score.toFixed( 2 ) } </Text>
                  </SimpleGrid>
                })}
              </Stack>
            </GridItem>
          </Grid>
        )
      })}
    </Box>
  )
}

export interface AttributeValueRarityHeaderProps {
  attribute: ITokenAttribute,
}

function AttributeValueRarityHeader({ attribute }: AttributeValueRarityHeaderProps ) {
  return(
    <h2>
      <AccordionButton _expanded={ { bg: useColorModeValue( 'gray.300', 'white' ) } }>
        <Box flex="1" textAlign="left">
          <Heading
            color={ useColorModeValue( 'gray.700', 'white' ) }
            fontSize={ 'xl' }
            fontFamily={ 'body' }
            textDecoration="underline"
            mb="1"
            flex="row"
          >
            { attribute.value }
            <Text fontSize="sm" textTransform="uppercase" color={ useColorModeValue( 'gray.500', 'white' ) } mt="1">
              (Score { attribute.score.toFixed( 2 ) })
            </Text>
          </Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
  )
}

export interface MarketListingProps {
  listing: IMarketListing,
  rarityCalculator: IRarityCalculator,
  currentRank: number,
  onClick: () => void;
}


function MarketListing({ listing, rarityCalculator, currentRank, onClick }: MarketListingProps ) {
  return (
    <Flex px={ 50 } py={ 4 } w="full" alignItems="center" justifyContent="center" direction="row">
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={ 1 }
        maxH="xl"
        overflowY="hidden"
      >
        <GridItem colSpan={ 1 }>
          <Box
            alignItems="center"
            justifyContent="center"
            bg={ useColorModeValue( 'white', 'gray.800' ) }
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
            minH="100%"
            onClick={ onClick }
            cursor="pointer"
          >
            {listing.isNew && (
              <Circle
                size="10px"
                position="absolute"
                top={ 2 }
                right={ 2 }
                bg="red.400"
              />
            )}

            <Image
              src={ listing.image }
              alt={ `Picture of ${listing.title}` }
              roundedTop="lg"
            />

            <Box p="6" height="100%" display="block">
              <Box d="flex" alignItems="baseline">
                {listing.isBest && (
                  <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                    Best
                  </Badge>
                )}
              </Box>
              <Flex mt="1" justifyContent="space-between" alignContent="center">
                <Box
                  fontSize="2xl"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  {listing.title}
                </Box>
                <Tooltip
                  label="Goto Listing"
                  bg="white"
                  placement={ 'top' }
                  color={ 'gray.800' }
                  fontSize={ '1.2em' }
                >
                  <chakra.a href={ listing.url } display={ 'flex' } target="_blank">
                    <Icon as={ FiShoppingCart } h={ 7 } w={ 7 } alignSelf={ 'center' } />
                  </chakra.a>
                </Tooltip>
              </Flex>

              <Flex justifyContent="space-between" alignContent="center">
                { listing.isBest &&
                  <Flex direction="column">
                    <Rating scoreRank={ listing.dailyBestScoreRank } type="day" />
                    <Rating scoreRank={ listing.weeklyBestScoreRank } type="week" />
                  </Flex>
                }
                <Box fontSize="2xl" color={ useColorModeValue( 'gray.800', 'white' ) }>
                  <Box as="span" color={ 'gray.600' } fontSize="lg">
                    SOL
                  </Box>
                  {listing.price.toFixed( 2 )}
                </Box>
              </Flex>
            </Box>
          </Box>
        </GridItem>

        <GridItem colSpan={ 2 } bg="gray.200" maxH="xl" minH="xl">
          <Box
            bg={ useColorModeValue( 'white', 'gray.800' ) }
            height="100%"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            p="6"
            position="relative"
          >
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                <Box justifyContent="space-between" alignContent="center" align="center" width="100%" mb="4">
                  <MarketListingHighlights listing={ listing } currentRank={ currentRank } />
                </Box>

                <Box overflowY="hidden"  width="100%">
                  <Accordion defaultIndex={ [ 0 ] } allowMultiple allowToggle pb="3" overflowY="scroll" height="md" width="100%">
                    { listing.attributes?.sort(( a, b ) => b.score - a.score ).map( attribute => {
                      return(
                        <AccordionItem key={ attribute.name }>
                          <AttributeValueRarityHeader
                            attribute={ attribute }
                          />
                          <AccordionPanel pb={ 4 }>
                            <AttributeRarity
                              tokenAttribute={ attribute }
                              rarityCalculator={ rarityCalculator }
                            />
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </Box>
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export interface CollapsedMarketListingProps {
  listing: IMarketListing,
  currentRank: number,
  onClick: () => void,
}

export function CollapsedMarketListing({ listing, currentRank, onClick }: CollapsedMarketListingProps ) {
  return (
    <Flex px={ 50 } py={ 4 } w="full" alignItems="center" justifyContent="center" direction="row">
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={ 1 }
        maxH="md"
        overflowY="hidden"
      >
        <GridItem colSpan={ 1 }>
          <Box
            alignItems="center"
            justifyContent="center"
            bg={ useColorModeValue( 'white', 'gray.800' ) }
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
            onClick={ onClick }
            cursor="pointer"
          >
            <Box p="6" height="100%" display="block">
              <Box d="flex" alignItems="baseline">
                {listing.isBest && (
                  <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                    Best
                  </Badge>
                )}
              </Box>
              <Flex mt="1" justifyContent="space-between" alignContent="center">
                <Box
                  fontSize="2xl"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  {listing.title}
                </Box>
                <Tooltip
                  label="Goto Listing"
                  bg="white"
                  placement={ 'top' }
                  color={ 'gray.800' }
                  fontSize={ '1.2em' }
                >
                  <chakra.a href={ listing.url } display={ 'flex' } target="_blank">
                    <Icon as={ FiShoppingCart } h={ 7 } w={ 7 } alignSelf={ 'center' } />
                  </chakra.a>
                </Tooltip>
              </Flex>

              <Flex justifyContent="space-between" alignContent="center">
                { listing.isBest &&
                  <Flex direction="column">
                    <Rating scoreRank={ listing.dailyBestScoreRank } type="day" />
                    <Rating scoreRank={ listing.weeklyBestScoreRank } type="week" />
                  </Flex>
                }
                <Box fontSize="2xl" color={ useColorModeValue( 'gray.800', 'white' ) }>
                  <Box as="span" color={ 'gray.600' } fontSize="lg">
                    SOL
                  </Box>
                  {listing.price.toFixed( 2 )}
                </Box>
              </Flex>
            </Box>
          </Box>
        </GridItem>

        <GridItem colSpan={ 2 } bg="gray.200">
          <Box
            bg={ useColorModeValue( 'white', 'gray.800' ) }
            height="100%"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            px="6"
            py="2"
            position="relative"
          >
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="l"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                <Box justifyContent="space-between" alignContent="center" align="center" width="100%">
                  <MarketListingHighlights listing={ listing } currentRank={ currentRank } />
                  { listing.topAttributes?.length > 0 &&
                    <Text mt={ 6 } textTransform="uppercase" letterSpacing={ 1.1 } color="gray.700" textStyle="bold">
                      { listing.topAttributes.map( attr => attr.value ).join( ', ' ) }
                    </Text>
                  }
                </Box>
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default MarketListing
