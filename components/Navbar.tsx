import {
  Box,
  Badge,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  FormControl,
  FormLabel,
  Text,
  IconButton,
  Input,
  InputGroup,
  Button,
  Select,
  Stack,
  Switch,
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
import { toast } from 'react-toastify';
import Moment from "moment"

import { globalContext } from '../store'
import SendPaymentToTreasury from './SendPaymentToTreasury'
import UserService from '../services/user.service'
import { IUser, ILanding } from '../types/user'


export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { globalState, dispatch } = useContext( globalContext )
  const { publicKey } = useWallet()
  const walletPublicKey = publicKey?.toString()
  const { user, landing } = globalState
  const {
    isOpen: isProfileOpen,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure()
  const [newUser, setNewUser] = useState(undefined as IUser | undefined)

  console.log('user', user)

  useEffect(() => {
    console.log( 'public key changed: ', walletPublicKey)

    if ( walletPublicKey ) {
      signInUser( walletPublicKey )
    }
  }, [ publicKey ])

  useEffect(() => {
    if ( !landing ) {
      loadLanding()
    }
  }, [ landing ])

  const loadLanding = async (): Promise<void> => {
      const landing = await UserService.getLanding()
      if ( landing ) {
        dispatch({ type: 'SET_LANDING', payload: landing })
      }
  }

  const signInUser = async ( walletPublicKey: string ): Promise<void> => {
    UserService.setSession( walletPublicKey )
    let user
    try {
      user = await UserService.get()
    } catch( err ) {
      console.log( 'user not found', err )

      return
    }

    if ( user?.verified ) {
      dispatch({ type: 'SET_USER', payload: user })
      toast.success("Signed In!", {
        position: toast.POSITION.TOP_CENTER
      })
    } else if ( user ) {
        setNewUser( user )
        toast.info("Please verify account", {
            position: toast.POSITION.TOP_CENTER
        })
    } else {
        dispatch({ type: 'SET_USER', payload: {
            id: undefined,
            createdAt: '',
            updatedAt: '',
            walletPublicKey,
            discordId: '',
            inactiveDate: '',
        } })
        toast.info("Welcome!", {
            position: toast.POSITION.TOP_CENTER
        })
    }
  }

  const signOutUser = (): void => {
    UserService.clearSession()
    onCloseProfile()
    dispatch({ type: 'SET_USER', payload: undefined })
    toast.success("Goodbye!", {
        position: toast.POSITION.TOP_CENTER
      })
  }

  const createUser = async ({ walletPublicKey, discordName }: IUser, verifyCode: number): Promise<boolean> => {
    const user = await UserService.create( {
        walletPublicKey,
        discordName,
        verifyCode,
    } )
    if ( !user ) return false
    dispatch({ type: 'SET_USER', payload: user })
    setNewUser( undefined )
    toast.success("User created!", {
        position: toast.POSITION.TOP_CENTER
      })

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
              BIBLE
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
            user={user || newUser}

            onClose={onCloseProfile}
            onCreateUser={createUser}
            onSignOut={signOutUser}
          />
        </Stack>
      </Flex>

      <Collapse in={ isOpen } animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

function ProfileDrawer({ isOpen, user, onClose, onCreateUser, onSignOut }: {
    isOpen: boolean,
    user: IUser,

    onClose: () => void,
    onCreateUser: (user: IUser, verifyCode: number) => Promise<boolean>,
    onSignOut: () => void;
}) {
    const firstField = useRef()
    const [ myUser, setMyUser ] = useState(user)
    const isVerified = !!myUser?.verified
    const [ verifyCode, setVerifyCode ] = useState(undefined as number | undefined)

    // clean this up!
    let inactiveDate = ""
    const trialCutoff = user ? Moment( user.createdAt ).add({ hours: 12 }) : undefined
    if ( trialCutoff ) inactiveDate = trialCutoff.format( 'LLL' )
    const isTrial = user?.createdAt ? Moment( user.createdAt ).add({ hours: 12 }).isAfter( Moment() ) : false
    const subsInactiveDt = user?.inactiveDate ? Moment( user.inactiveDate ) : undefined
    if ( subsInactiveDt ) inactiveDate = subsInactiveDt.format( 'LLL' )
    let isActive = inactiveDate ? Moment().isBefore( inactiveDate ) : false
    if ( user?.isOG ) {
      inactiveDate = "Never"
      isActive = true
    }


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
                                disabled={isVerified}
                                backgroundColor={isVerified ? "gray.300" : undefined }
                                onChange={ e => setMyUser({ ...myUser, discordName: e.target.value })}
                            />
                        </InputGroup>

                        { !isVerified &&
                            <>
                                <FormLabel htmlFor="verifyCode">Discord Verification Code</FormLabel>
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
                            </>
                        }
                        { isVerified &&
                            <Stack>
                                <FormLabel htmlFor="url">Active Until</FormLabel>
                                <InputGroup fontSize="sm" marginBottom="3">
                                    <Input
                                        type="text"
                                        id="activeThrough"
                                        fontSize="sm"
                                        width="xl"
                                        value={inactiveDate}
                                        disabled={true}
                                        backgroundColor={"gray.300"}
                                    />
                                </InputGroup>
                            </Stack>
                        }

                        <Stack direction="row" mt="2">
                            { isActive &&
                                <Badge colorScheme="blue"
                                    borderRadius="md"
                                    fontSize="xs"
                                    paddingX="2"
                                >
                                    Active
                                </Badge>
                            }
                            { isTrial && 
                                <Badge colorScheme="green"
                                    borderRadius="md"
                                    fontSize="xs"
                                    paddingX="2"
                                >
                                    Active Trial
                                </Badge>
                            }
                            { !isActive && 
                                <Badge colorScheme="red"
                                    borderRadius="md"
                                    fontSize="xs"
                                    paddingX="2"
                                >
                                    Inactive
                                </Badge>
                            }
                        </Stack>
                    </Box>

                    { isVerified &&
                        <Stack paddingY="4">
                            <SendPaymentToTreasury />
                        </Stack>
                    }

                    { !isVerified &&
                        <Box marginTop="4">
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
                    }
                    
                    </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                    <WalletDisconnectButton onClick={onSignOut} />
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
            </>
    )
  }

  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    const { globalState, dispatch } = useContext( globalContext )
    const { landing } = globalState
    const navItems = getNavItems(landing)
  
    return (
      <Stack direction={'row'} spacing={4}>
        {navItems.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  href={navItem.href}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
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
    const { globalState, dispatch } = useContext( globalContext )
    const { landing } = globalState
    const navItems = getNavItems(landing)

    return (
      <Stack
        bg={ useColorModeValue( 'white', 'gray.800' ) }
        p={ 4 }
        display={ { md: 'none' } }
      >
        {navItems.map( navItem => (
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

const getNavItems = (landing: ILanding): Array<NavItem> =>  {
  return [
    {
      label: 'Collections',
      children: !landing ? [] : Object.keys( landing.collections ).map( key => {
        return({
          label: key,
          href: landing.collections[key],
        })
      }),
    },
  ]
}