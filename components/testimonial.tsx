import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'

export  const Testimonial = ({ children }: { children: ReactNode }) => {
  return <Box>{children}</Box>
}

export const TestimonialContent = ({ children }: { children: ReactNode }) => {
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

export const RegularContent = ({ children }: { children: ReactNode }) => {
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

export const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <Heading as={ 'h3' } fontSize={ 'xl' }>
      {children}
    </Heading>
  )
}

export const TestimonialText = ({ children }: { children: ReactNode }) => {
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

export const TestimonialAvatar = ({
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
