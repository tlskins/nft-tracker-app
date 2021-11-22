import Head from 'next/head'
import {
  Box,
  Heading,
  Code,
  Container,
  Tag,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  OrderedList,
  ListItem,
} from '@chakra-ui/react'
import Link from 'next/link'
import Hero from './Hero'

export default function UnauthorizedHero() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={ '7xl' }>
        <Stack
          as={ Box }
          textAlign={ 'center' }
          spacing={ { base: 4, md: 6 } }
          py={ { base: 20, md: 36 } }
        >
          <Heading
            fontWeight={ 600 }
            fontSize={ { base: '2xl', sm: '4xl', md: '6xl' } }
            lineHeight={ '110%' }
          >
            Start your {' '}
            <Text as={ 'span' } color={ 'orange.400' }>
            Degen Bible
            </Text>
            {' '}Subscription
          </Heading>

          <Text fontWeight={ 500 }>
            <Tag backgroundColor="blue" color="white">Select Wallet</Tag>
            {' '}to get started!
          </Text>
        </Stack>
      </Container>

      <Container maxW={ '7xl' } backgroundColor="white">
        <Hero />
      </Container>
    </>
  )
}
