import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Button,
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
  Link,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useState } from 'react'
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
      {/* <SmallStatsCard
        title="Current Rank"
        stat={ `#${ currentRank }` }
      /> */}
      { listing.rank &&
        <SmallStatsCard
          title="Rank"
          stat={ `#${listing.rank}` }
        />
      }
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
        title="ROI"
        stat={ `${( listing.score * 100 ).toFixed( 1 )}%` }
      />
    </SimpleGrid>
  )
}

function SuggestedPriceBreakdown({ listing } : { listing: IMarketListing }) {
  const hasBreakdown = listing.featureNames?.length > 0 &&
    listing.coefficients?.length > 0 &&
    listing.features?.length > 0
  const scoreSum = listing.coefficients[0] + listing.features.reduce(( sum, val, idx ) => {
    return sum + listing.coefficients[idx + 1] * val
  }, 0.0 )
  const scoreSumStr = scoreSum.toFixed( 2 )

  return(
    <Table variant="striped" fontSize="xs" size="sm">
      <TableCaption>Suggested price regression breakdown</TableCaption>
      { hasBreakdown &&
        <>
          <Thead>
            <Tr>
              <Th> Type </Th>
              <Th> Fixed </Th>
              { listing.featureNames.map( ftNm => (
                <Th key={ ftNm }> { ftNm } </Th>
              ))}
              <Th> Total </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td> Coefficients </Td>
              { listing.coefficients.map(( coeff, i ) => (
                <Td key={ i }> { coeff.toFixed( 3 ) } </Td>
              ))}
              <Td />
            </Tr>
            <Tr>
              <Td> Listing Value </Td>
              <Td> - </Td>
              { listing.features.map(( val, i ) => (
                <Td key={ i }> { val.toFixed( 2 ) } </Td>
              ))}
              <Td />
            </Tr>
            <Tr>
              <Td> Feature Score </Td>
              <Td> { listing.coefficients[0].toFixed( 2 ) } </Td>
              { listing.features.map(( val, i ) => (
                <Td key={ i }> { ( listing.coefficients[i + 1] * val ).toFixed( 2 ) } </Td>
              ))}
              <Td> { scoreSumStr } </Td>
            </Tr>
          </Tbody>
        </>
      }
    </Table>
  )
}

function AttributesTable({ attributes } : { attributes: Array<ITokenAttribute> }) {
  const attrs = attributes.sort(( a, b ) => b.suggestedPrice - a.suggestedPrice )

  return(
    <>
      <Text textTransform="uppercase"
        textDecoration="underline"
        fontSize="xs"
      >
        Attributes ({ attrs.length })
      </Text>

      <Grid
        columns={ 3 }
        templateColumns="repeat(3, 1fr)"
        mt={ 1 }
        direction={ 'column' }
        spacing={ 4 }
        align={ 'left' }
        pl={ 2 }
      >
        { attrs.map(( attr, i ) => (
          <Text color={ 'gray.500' }
            key={ i }
            align="left"
            fontSize="x-small"
          >
            { attr.name }: { attr.value } ({ attr.rarity })
          </Text>
        ))}
      </Grid>
    </>
  )
}

interface IAttributeRariyProps {
  tokenAttribute: ITokenAttribute;
  rarityCalculator: IRarityCalculator;
}

function AttributeRarity({ tokenAttribute, rarityCalculator }: IAttributeRariyProps ) {
  const rarityValuation: IRarityValuation | undefined = rarityCalculator?.lookup[tokenAttribute.name][tokenAttribute.value] as IRarityValuation | undefined
  const { rarityValue } = ( rarityValuation || {})

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
          <Stack
            textTransform={ 'uppercase' }
            fontWeight={ 800 }
            fontSize={ 'xs' }
            letterSpacing={ 0.7 }
            pl="2"
          >
            <SimpleGrid columns={ 2 } spacing={ 0 }>
              <Text> Suggested Price </Text> <Text> { rarityValue.suggestedPrice?.toFixed( 2 ) || '?' } SOL </Text>
              <Text> Rarity </Text> <Text> { rarityValuation.rarity || '?' } </Text>
              <Text> Total Daily Sales </Text> <Text> { rarityValue.totalDailySales } </Text>
              { rarityValue.totalDailySales !== 0 &&
                <>
                  <Text> Avg Sale Price </Text>
                  <Text> { rarityValue.avgSalePrice.toFixed( 2 ) } </Text>
                  <Text> Total Daily Volume </Text>
                  <Text> { rarityValue.totalDailyVolume.toFixed( 2 ) } </Text>
                </>
              }
            </SimpleGrid>
          </Stack>
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
        <Text
          color={ 'green.500' }
          textTransform={ 'uppercase' }
          fontStyle="under"
          fontWeight={ 800 }
          fontSize={ 'sm' }
          letterSpacing={ 1.1 }
          marginTop="5"
        >
          Sales
        </Text>
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
            padding={ 2 }
          >
            <GridItem colSpan={ 1 } fontSize={ 'xs' } color={ 'gray.500' } alignContent="center">
              <Text fontWeight="bold" fontSize="sm" color="gray.700">{ sale.price } SOL</Text>
              <Text>{ sale.name }</Text>
              <Text>Rank #{ sale.rank }</Text>
              <Text> { Moment( sale.date ).format( 'LLL' ) } </Text>
            </GridItem>

            <GridItem colSpan={ 3 } alignContent="center" alignItems="center" textAlign="center">
              <AttributesTable attributes={ sale.attributes } />
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
        <Text
          color={ 'green.500' }
          textTransform={ 'uppercase' }
          fontStyle="under"
          fontWeight={ 800 }
          fontSize={ 'sm' }
          letterSpacing={ 1.1 }
          marginTop="5"
        >
          Current Listings
        </Text>
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
      <Grid
        columns={ 3 }
        templateColumns="repeat(3, 1fr)"
        mt={ 1 }
        direction={ 'column' }
        spacing={ 4 }
        align={ 'left' }
        pl={ 2 }
      >
        { rarityValue?.currentListings.map(( list, i ) => {
          return(
            <Link href={ list.url } isExternal fontSize="xs" key={ i }>
              { list.title } (Rk { list.rank || '?' }) @ { list.price } SOL <ExternalLinkIcon mx="2px" />
            </Link>
          )
        })}
      </Grid>
    </Box>
  )
}

export interface AttributeValueRarityHeaderProps {
  attribute: ITokenAttribute,
  rarityCalculator: IRarityCalculator;
}

function AttributeValueRarityHeader({ attribute, rarityCalculator }: AttributeValueRarityHeaderProps ) {
  const rarityValuation: IRarityValuation | undefined = rarityCalculator?.lookup[attribute.name][attribute.value] as IRarityValuation | undefined
  const { rarityValue } = ( rarityValuation || {})

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
            { attribute.value } ({ attribute.rarity })
            <Text fontSize="sm" textTransform="uppercase" color={ useColorModeValue( 'gray.500', 'white' ) } mt="1">
              (Suggested Price: { rarityValue?.suggestedPrice?.toFixed( 2 ) || '?' } SOL)
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
  const [ showSuggBreakdown, setShowSuggBreakdown ] = useState( false )

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

                <Flex mb="4" overflowX="scroll" flexDirection="column">
                  <Button
                    colorScheme="teal"
                    size="xs"
                    width="sm"
                    mb="4"
                    onClick={ () => setShowSuggBreakdown( !showSuggBreakdown ) }
                  >
                    { showSuggBreakdown ? 'Hide' : 'Show' } Suggested Price Breakdown
                  </Button>
                  { showSuggBreakdown &&
                    <SuggestedPriceBreakdown listing={ listing } />
                  }
                </Flex>

                <Box overflowY="hidden"  width="100%">
                  <Accordion defaultIndex={ [ 0 ] } allowMultiple allowToggle pb="3" overflowY="scroll" height="md" width="100%">
                    { listing.attributes?.sort(( a, b ) => b.suggestedPrice - a.suggestedPrice )
                      .map( attribute => {
                        return(
                          <AccordionItem key={ attribute.name }>
                            <AttributeValueRarityHeader
                              attribute={ attribute }
                              rarityCalculator={ rarityCalculator }
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
                <MarketListingHighlights listing={ listing } currentRank={ currentRank } />
                {/* { listing.topAttributes?.length > 0 &&
                    <Text mt={ 6 } textTransform="uppercase" letterSpacing={ 1.1 } color="gray.700" textStyle="bold">
                      { listing.topAttributes.map( attr => attr.value ).join( ', ' ) }
                    </Text>
                  } */}
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default MarketListing
