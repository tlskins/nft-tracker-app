import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  FormLabel,
  Text,
  IconButton,
  Input,
  InputLeftAddon,
  InputRightAddon,
  InputRightElement,
  InputGroup,
  Button,
  Select,
  Stack,
  Collapse,
  Container,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  VStack,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import { useContext, useEffect, useState, useRef } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'

import { globalContext } from '../store'
import SendPaymentToTreasury from './SendPaymentToTreasury'
import { Notification } from './notification'
import UserService from '../services/user.service'
import { IUser } from '../types/user'


export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { globalState, dispatch } = useContext( globalContext )
  const { publicKey } = useWallet()
  const walletPublicKey = publicKey?.toString()
  const { user } = globalState
    const {
        isOpen: isProfileOpen,
        onOpen: onOpenProfile,
        onClose: onCloseProfile,
    } = useDisclosure()

  useEffect(() => {
    if ( walletPublicKey ) {
      console.log( 'public key!', walletPublicKey)
      signInUser( walletPublicKey)
    } else if ( !walletPublicKey && user ) {
      signOutUser()
    }
  }, [ publicKey ])

  const signInUser = async ( walletPublicKey: string ): Promise<void> => {
    let user
    try {
      user = await UserService.get( walletPublicKey )
    } catch( err ) {
      console.log( 'err get user', err )

      return
    }

    if ( user ) {
      dispatch({ type: 'SET_USER', payload: user })
      toast.custom(
        <Notification
          message="Signed In!"
          variant="success"
        />
      )
    } else {
        dispatch({ type: 'SET_USER', payload: {
            id: undefined,
            createdAt: '',
            updatedAt: '',
            walletPublicKey,
            discordId: '',
            inactiveDate: '',
        } })
        toast.custom(
          <Notification
            message="Welcome!"
            variant="success"
          />
        )
    }
  }

  const signOutUser = (): void => {
    dispatch({ type: 'SET_USER', payload: undefined })
    toast.custom(
      <Notification
        message="Signed Out!"
        variant="success"
      />
    )
  }

  const createUser = async ({ walletPublicKey, discordName }: IUser, verifyCode: number): Promise<boolean> => {
    const user = await UserService.create( {
        walletPublicKey,
        discordName,
        verifyCode,
    } )
    if ( !user ) return false
    dispatch({ type: 'SET_USER', payload: user })
    toast.custom(
        <Notification
            message={ "Successfully created user!" }
            variant="success"
        />
    )

    return true
  }

  return (
    <Box>
      <Flex
        bg={ useColorModeValue( 'white', 'gray.800' ) }
        color={ useColorModeValue( 'gray.600', 'white' ) }
        minH={ '60px' }
        py={ { base: 2 } }
        px={ { base: 4 } }
        borderBottom={ 1 }
        borderStyle={ 'solid' }
        borderColor={ useColorModeValue( 'gray.200', 'gray.900' ) }
        align={ 'center' }
      >
        <Flex
          flex={ { base: 1, md: 'auto' } }
          ml={ { base: -2 } }
          display={ { base: 'flex', md: 'none' } }
        >
          <IconButton
            onClick={ onToggle }
            icon={
              isOpen ? <CloseIcon w={ 3 } h={ 3 } /> : <HamburgerIcon w={ 5 } h={ 5 } />
            }
            variant={ 'ghost' }
            aria-label={ 'Toggle Navigation' }
          />
        </Flex>
        <Flex flex={ { base: 1 } } justify={ { base: 'center', md: 'start' } }>
          <Text
            textAlign={ useBreakpointValue({ base: 'center', md: 'left' }) }
            fontFamily={ 'heading' }
            color={ useColorModeValue( 'gray.800', 'white' ) }
          >
              Logo
          </Text>

          <Flex display={ { base: 'none', md: 'flex' } } ml={ 10 }>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={ { base: 1, md: 0 } }
          justify={ 'flex-end' }
          direction={ 'row' }
          spacing={ 6 }
        >
          { publicKey &&
            <>
                <Button
                    display={ { base: 'none', md: 'inline-flex' } }
                    fontSize={ 'sm' }
                    fontWeight={ 600 }
                    color={ 'white' }
                    bg={ 'pink.400' }
                    href={ '#' }
                    _hover={ { bg: 'pink.300' } }
                    onClick={onOpenProfile}
                >
                    Profile
                </Button>
            </>
          }
          { !publicKey &&
            <Stack width="xs">
                <Container align={'right'}>
                    <WalletMultiButton />
                </Container>
            </Stack>
          }

          <ProfileDrawer
            isOpen={isProfileOpen}
            user={user}

            onClose={onCloseProfile}
            onCreateUser={createUser}
          />
        </Stack>
      </Flex>

      <Collapse in={ isOpen } animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

function ProfileDrawer({ isOpen, user, onClose, onCreateUser }: {
    isOpen: boolean,
    onClose: () => void,
    onCreateUser: (user: IUser, verifyCode: number) => Promise<boolean>,
    user: IUser,
}) {
    const firstField = useRef()
    const [ myUser, setMyUser ] = useState(user)
    const isNewUser = !myUser?.id
    const [ verifyCode, setVerifyCode ] = useState(undefined as number | undefined)

    useEffect(() => {
        setMyUser( user )
      }, [ user ])

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                    <Box>
                        <FormLabel htmlFor="wallet">Wallet</FormLabel>
                        <Input
                            id="wallet"
                            value={ myUser?.walletPublicKey }
                            disabled={true}
                            backgroundColor="gray.300"
                            fontSize="sm"
                        />
                    </Box>
                </DrawerHeader>

                <DrawerBody>
                    <Stack spacing="24px">
                    <Box>
                        <FormLabel htmlFor="url">Discord User Name</FormLabel>
                        <InputGroup fontSize="sm" marginBottom="3">
                            <Input
                                ref={firstField}
                                type="text"
                                id="userNm"
                                placeholder="armanif#142"
                                fontSize="sm"
                                width="xl"
                                value={myUser?.discordName}
                                onChange={ e => setMyUser({ ...myUser, discordName: e.target.value })}
                            />
                        </InputGroup>

                        <FormLabel htmlFor="url">Discord Verification Code</FormLabel>
                        <InputGroup fontSize="sm">
                            <Input
                                type="text"
                                id="verifyCode"
                                placeholder="123456"
                                fontSize="sm"
                                width="xl"
                                value={verifyCode}
                                onChange={ e => setVerifyCode( parseInt( e.target.value )) }
                            />
                        </InputGroup>
                    </Box>

                    { !isNewUser &&
                        <Box>
                            <SendPaymentToTreasury />
                        </Box>
                    }

                    <Box>
                        <Button
                            bg={ 'blue.400' }
                            color={ 'white' }
                            _hover={ { bg: 'blue.500' } }
                            onClick={ async () => {
                                if ( await onCreateUser(myUser, verifyCode) ) {
                                    setVerifyCode(undefined)
                                }
                            }}
                        >
                            Create User
                        </Button>
                    </Box>
                    </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                    <WalletDisconnectButton />
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
            </>
    )
  }

  const DesktopNav = () => {
    const linkColor = useColorModeValue( 'gray.600', 'gray.200' )
    const linkHoverColor = useColorModeValue( 'gray.800', 'white' )
    const popoverContentBgColor = useColorModeValue( 'white', 'gray.800' )
  
    return (
      <Stack direction={ 'row' } spacing={ 4 }>
        {NAV_ITEMS.map( navItem => (
          <Box key={ navItem.label }>
            <Popover trigger={ 'hover' } placement={ 'bottom-start' }>
              <PopoverTrigger>
                <Link
                  p={ 2 }
                  href={ navItem.href ?? '#' }
                  fontSize={ 'sm' }
                  fontWeight={ 500 }
                  color={ linkColor }
                  _hover={ {
                    textDecoration: 'none',
                    color: linkHoverColor,
                  } }
                >
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={ 0 }
                  boxShadow={ 'xl' }
                  bg={ popoverContentBgColor }
                  p={ 4 }
                  rounded={ 'xl' }
                  minW={ 'sm' }
                >
                  <Stack>
                    {navItem.children.map( child => (
                      <DesktopSubNav key={ child.label } { ...child } />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    )
  }
  
  const DesktopSubNav = ({ label, href, subLabel }: NavItem ) => {
    return (
      <Link
        href={ href }
        role={ 'group' }
        display={ 'block' }
        p={ 2 }
        rounded={ 'md' }
        _hover={ { bg: useColorModeValue( 'pink.50', 'gray.900' ) } }
      >
        <Stack direction={ 'row' } align={ 'center' }>
          <Box>
            <Text
              transition={ 'all .3s ease' }
              _groupHover={ { color: 'pink.400' } }
              fontWeight={ 500 }
            >
              {label}
            </Text>
            <Text fontSize={ 'sm' }>{subLabel}</Text>
          </Box>
          <Flex
            transition={ 'all .3s ease' }
            transform={ 'translateX(-10px)' }
            opacity={ 0 }
            _groupHover={ { opacity: '100%', transform: 'translateX(0)' } }
            justify={ 'flex-end' }
            align={ 'center' }
            flex={ 1 }
          >
            <Icon color={ 'pink.400' } w={ 5 } h={ 5 } as={ ChevronRightIcon } />
          </Flex>
        </Stack>
      </Link>
    )
  }

  const MobileNav = () => {
    return (
      <Stack
        bg={ useColorModeValue( 'white', 'gray.800' ) }
        p={ 4 }
        display={ { md: 'none' } }
      >
        {NAV_ITEMS.map( navItem => (
          <MobileNavItem key={ navItem.label } { ...navItem } />
        ))}
      </Stack>
    )
  }

const MobileNavItem = ({ label, children, href }: NavItem ) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={ 4 } onClick={ children && onToggle }>
      <Flex
        py={ 2 }
        as={ Link }
        href={ href ?? '#' }
        justify={ 'space-between' }
        align={ 'center' }
        _hover={ {
          textDecoration: 'none',
        } }
      >
        <Text
          fontWeight={ 600 }
          color={ useColorModeValue( 'gray.600', 'gray.200' ) }
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ ChevronDownIcon }
            transition={ 'all .25s ease-in-out' }
            transform={ isOpen ? 'rotate(180deg)' : '' }
            w={ 6 }
            h={ 6 }
          />
        )}
      </Flex>

      <Collapse in={ isOpen } animateOpacity style={ { marginTop: '0!important' } }>
        <Stack
          mt={ 2 }
          pl={ 4 }
          borderLeft={ 1 }
          borderStyle={ 'solid' }
          borderColor={ useColorModeValue( 'gray.200', 'gray.700' ) }
          align={ 'start' }
        >
          {children &&
              children.map( child => (
                <Link key={ child.label } py={ 2 } href={ child.href }>
                  {child.label}
                </Link>
              ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

  interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
  }

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Inspiration',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '#',
      },
      {
        label: 'New & Noteworthy',
        subLabel: 'Up-and-coming Designers',
        href: '#',
      },
    ],
  },
  {
    label: 'Find Work',
    children: [
      {
        label: 'Job Board',
        subLabel: 'Find your dream design job',
        href: '#',
      },
      {
        label: 'Freelance Projects',
        subLabel: 'An exclusive list for contract work',
        href: '#',
      },
    ],
  },
  {
    label: 'Learn Design',
    href: '#',
  },
  {
    label: 'Hire Designers',
    href: '#',
  },
]
