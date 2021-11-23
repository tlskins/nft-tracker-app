import {
  Container,
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { GoDeviceMobile } from 'react-icons/go'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { AiFillCheckCircle } from 'react-icons/ai'
import { ReactElement } from 'react'

import ImageCarousel from './ImageCarousel'

  interface FeatureProps {
    text: string;
    subtext?: string;
    iconBg: string;
    icon?: ReactElement;
  }

const Feature = ({ text, icon, iconBg, subtext }: FeatureProps ) => {
  return (
    <Stack direction={ 'row' } align={ 'center' }>
      <Flex
        w={ 8 }
        h={ 8 }
        align={ 'center' }
        justify={ 'center' }
        rounded={ 'full' }
        mr="4"
        bg={ iconBg }
      >
        {icon}
      </Flex>
      <Stack direction={ 'column' }>
        <Text fontWeight={ 600 }>{text}</Text>
        { subtext &&
            <Text fontWeight={ 400 }>{subtext}</Text>
        }
      </Stack>
    </Stack>
  )
}

export default function Hero() {
  return (
    <Container maxW={ '5xl' } py={ 12 }>
      <SimpleGrid columns={ { base: 1, md: 2 } } spacing={ 10 }>
        <Stack spacing={ 4 }>
          {/* <Text
            textTransform={ 'uppercase' }
            color={ 'blue.400' }
            fontWeight={ 600 }
            fontSize={ 'sm' }
            bg={ useColorModeValue( 'blue.50', 'blue.900' ) }
            p={ 2 }
            alignSelf={ 'flex-start' }
            rounded={ 'md' }
          >
              Our Story
          </Text> */}
          <Heading
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
              bg: 'red.200',
              zIndex: -1,
            } }
          >
            Degen Bible
          </Heading>
          <Text fontSize="lg">
            What if, you could just get a discord notification of some paper hand
            listing in the middle of a meeting, and with one click, you go to the
            listing, plug in your phantom mobile app 🤞, and buy it before the
            meeting is over.
            <br /><br />
            Degenbible makes this possible by pulling all market listings,
            rarity data, ranking data, and sales histories every 5 minutes to
            continuously train our model on current data to tell us which are
            the current top listings for each collection and then push those
            listings to you.
          </Text>
          {/* <Text fontSize={ 'lg' } textAlign="center">
            Unlock access to mobile push alerts of the best listings as they are
            posted through our private discord channel! We process every listing
            and sale every 5 minutes to build a model for predicting each NFT's
            price so we know which ones are undervalued. Let us cross reference
            rarities and ranks for you in real time so you can spend less time
            refreshing floor prices and spend more time sniping these paper hands!
          </Text> */}

          <Stack
            spacing={ 4 }
            divider={
              <StackDivider
                borderColor={ useColorModeValue( 'gray.100', 'gray.700' ) }
              />
            }
          >
            <Feature
              icon={
                <Icon as={ GoDeviceMobile } color={ 'yellow.500' } w={ 5 } h={ 5 } />
              }
              iconBg={ useColorModeValue( 'yellow.100', 'yellow.900' ) }
              text={ 'Mobile push alerts of the best listings' }
              subtext={ 'We process every listing and sale every 5 minutes to build a model for predicting each NFT\'s price so we know which ones are undervalued.' }
            />
            <Feature
              icon={
                <Icon as={ GiMagnifyingGlass } color={ 'purple.500' } w={ 5 } h={ 5 } />
              }
              iconBg={ useColorModeValue( 'purple.100', 'purple.900' ) }
              text={ 'Track & analyze your favorite collections' }
              subtext={ 'Stay up to date on your favorite collections. Analyze rarities, ranks, floors, sales per hour at the click of a button. View comparable sales and listings and even view our regression model!' }
            />
            <Feature
              icon={
                <Icon as={ AiFillCheckCircle } color={ 'green.500' } w={ 5 } h={ 5 } />
              }
              iconBg={ useColorModeValue( 'green.100', 'green.900' ) }
              text={ 'Click Select Wallet to start your free trial now!' }
              subtext={ 'After you link your wallet you will be instructed to join our Discord. After verification your free trial begins.' }
            />
          </Stack>
        </Stack>
        <Flex>
          <ImageCarousel
            imgs={ [
              'https://cdn.alpha.art/opt/e/c/ec36647eb825f38a10a81965e17d5018981295a6/original.webp',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/q9I8IGSHjIPqHJecBOoUcJBRTds1JT6jbjgA-dXKlbw/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/OgPs0ZRnRqxBfC6WPCHeCKO1tAkeva8S-0yC2KOnW3Y/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/ipfs.io/ipfs/QmWNZ6UxB1RUgRGDBohecYXoq4SMmD2CHoDd1rxTx5UyvN',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/-A2jPbTx8H18Z8gp8vD6S39Un0yVh5NgkBXQbc7AJdE?ext=jpeg',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/yzTLchEEl4o-BV5nkwHlcNLnMUVs_4MYJMzTnsosDM4/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/0rgFPUstRAk7eYm0Y4LGJN7oCErnP9LGgDOZgK43NfY/data.png',
              'https://arweave.net/BWIb_msV2u9hliu_NXo4HPieNxR-8jKt6shuJH9By74',
              'http://arweave.net/PlSJkjPfl2fNRFhfi5xJOiAd4Yhf-SCbOVC0ubrORoU/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/E8Xf8Mk1RfAUzZTwAhmdnrJanJ97pj4BbnEoNjgqu7Y/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/cdn.piggygang.com/imgs/f3379636f59c32e9eba8b470dd37c65d.jpg',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/j1a9H2S3D69GgwUWXhJFEzOcZU-DcRdZ_e1Jyll_5VM/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/MIRFETfmVCAbxDcPwQMt990rxNWI1VAhgAyO-gVJEos/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/w_likkYBI5Z9niYD-nGOpkpUyNdPKLhtDhfvLzF95-Y/data.png',
              'http://arweave.net/i7Z4XpJtEYR6PLOmo2qxFSlY-_6V2dcIMO_mYD7LgvI/data.png',
              'https://hkgwtdvfyh.medianetwork.cloud/unsafe/600x600/filters:format(webp)/www.arweave.net/UTlgFHokJxqzo1jgWuCd07DPS0ESYgOA-ojKSNyYXIE/data.png',
              'https://cdn.alpha.art/opt/d/c/dc94c0814f654348aa2a3736eebdd47f7cdc33e6/340.webp',
            ] }
          />
          {/* <Image
            rounded={ 'md' }
            alt={ 'feature image' }
            src={
              'https://cdn.alpha.art/opt/e/c/ec36647eb825f38a10a81965e17d5018981295a6/original.webp'
            }
            objectFit={ 'cover' }
          /> */}
        </Flex>
      </SimpleGrid>
    </Container>
  )
}
