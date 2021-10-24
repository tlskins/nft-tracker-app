import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import CollectionTrackerDataService from "../services/collectionTracker.service"
import { ICollectionTracker } from '../types/collectionTracker';

const Testimonial = ({ children }: { children: ReactNode }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  );
};

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
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function Homepage() {
  const [tracker, setTracker] = useState(undefined as ICollectionTracker | undefined)
  const {
    currentBest,
    floorPrice: currentFloor,
    lastDayFloor,
    lastWeekFloor,
    hourlySales,
    averageSalesPrice,
  } = tracker || {}

  useEffect(() => {
    (async function loadCollectionTracker() {
      const tracker = await CollectionTrackerDataService.get("jungle-cats")
      console.log('loaded', tracker)

      if ( tracker ) setTracker(tracker)
      })();
  }, []);

  console.log('tracker', tracker)

  if ( !tracker ) {
    return(
      <Box bg={useColorModeValue('gray.100', 'gray.700')}>
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>{ tracker?.collection }</Heading>
          {/* <Text>We have been working with clients around the world</Text> */}
        </Stack>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="center"
          justifyContent="center"
          spacing={{ base: 10, md: 4, lg: 10 }}>

            <Testimonial>
              <TestimonialContent>
                <TestimonialHeading>
                  Floors 
                </TestimonialHeading>
                <TestimonialText>
                  <Container w="100%">
                    Current { currentFloor.floorPrice } { currentFloor.percentChange && `(${currentFloor.percentChange.toFixed(2)}%)` }<br />
                    Last Day Avg { lastDayFloor.floorPrice } { lastDayFloor.percentChange && `(${lastDayFloor.percentChange.toFixed(2)}%)` }<br />
                    Last Week Avg { lastWeekFloor.floorPrice }<br />
                  </Container>
                </TestimonialText>
              </TestimonialContent>
            </Testimonial>

            <Testimonial>
              <TestimonialContent>
                <TestimonialHeading>
                  Best 
                </TestimonialHeading>
                <TestimonialText>
                  <Container w="100%">
                    Current Best: { currentBest.title } <br />
                    { currentBest.rarity } @ { currentBest.price.toFixed(2) }<br />
                    Score: { currentBest.score.toFixed(2) } | Suggested Price: { currentBest.suggestedPrice.toFixed( 2 ) }<br />
                  </Container>
                </TestimonialText>
              </TestimonialContent>
              <TestimonialAvatar
                src={ currentBest.image }
                name={currentBest.title}
                title={currentBest.rarity}
              />
            </Testimonial>
          
            <Testimonial>
              <TestimonialContent>
                <TestimonialHeading>
                  Volume 
                </TestimonialHeading>
                <TestimonialText>
                  <Container w="100%">
                    Hourly Sales: { hourlySales?.toFixed( 2 ) || "N/A" }<br />
                    Last Week Avg { lastWeekFloor.floorPrice || "N/A" }<br />
                  </Container>
                </TestimonialText>
              </TestimonialContent>
            </Testimonial>

        </Stack>
      </Container>
    </Box>
  );
}