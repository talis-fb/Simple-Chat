import type { NextPage } from 'next'
import { useEffect, useState, useRef } from 'react'
import {
  Input,
  Center,
  Box,
  Text,
  Flex,
  Spacer,
  Avatar,
  Grid,
  GridItem,
  Menu,
  Image,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  VStack,
  StackDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  HStack,
  PinInput,
  PinInputField,
  Divider,
  useClipboard,
  useToast,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { CloseIcon, EditIcon, SettingsIcon, AddIcon } from '@chakra-ui/icons'

import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebase-config.json'
import {
  sendMessage as submitMessageFirestore,
  addContact,
  getProfilePhotoOrNameUser,
  updateProfile,
} from '../firebase/methods'

// Import of useSelector and UseDispatch, but with type of our store
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getName, getUser, getEmail, updateName, updatePhotoProfile } from '../store/userSlice'
import {
  newMessage,
  selectChat,
  selectChatMessages,
  selectAllChat,
  getChatOpen,
  setChatOpen,
} from '../store/chatsSlice'

// Components
import DrawerProfile from '../components/DrawerProfile'

const Home: NextPage = () => {
  // store
  const user = useAppSelector(getUser)

  // Hooks
  const dispatch = useAppDispatch()
  const app = initializeApp(firebaseConfig)
  const auth = getAuth()
  const [isOpen, setOpen] = useState(false)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  // Manage of chats
  const [openChat, setOpenChat] = useState<string>('main')
  const conversas: { [key: string]: any } = useAppSelector(selectAllChat)
  const onChat = useAppSelector(getChatOpen)
  const setOnChat = (chatName: string) => dispatch(setChatOpen(chatName))
  const arrayOfConversasValues = Object.values(conversas)
  const arrayOfConversasKeys = Object.keys(conversas)

  // User
  const logout = () => {
    auth.signOut()
  }

  // Function to copy PIN
  const { hasCopied, onCopy } = useClipboard(user.pin)
  const toast = useToast()
  const getPin = () => {
    onCopy()
    toast({
      title: 'PIN copiado',
      description: 'Basta agora clicar Ctrl+V e enviar para seus abiguinhos',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  // Add Pin
  const [pinToAdd, setPinToAdd] = useState('')

  // Textarea and send message
  const [text, setText] = useState('')
  const anchorToScrollDownInSendMessage = useRef<HTMLDivElement>(null)
  const sendMessage = async () => {
    await submitMessageFirestore(conversas[onChat].uid, { body: text, from: user.uid })
    setText('')
    if (anchorToScrollDownInSendMessage.current)
      anchorToScrollDownInSendMessage.current.scrollIntoView({ behavior: 'smooth' })
  }

  const dis = useDisclosure()
  const isOpenDrawer = dis.isOpen
  const onOpenDrawer = dis.onOpen
  const onCloseDrawer = dis.onClose

  // useEffect(() => {
  //   if (!user.name && !user.photoURL) {
  //     onOpenDrawer()
  //   }
  // }, [])

  const [nameProfileSettings, setNameProfileSettings] = useState(user.name)
  const [photoProfileSettings, setPhotoProfileSettings] = useState(user.photoURL)

  return (
    <Grid bg="gray.800" h={'100vh'} templateColumns="repeat(4, 1fr)">
      <GridItem color="white" colSpan={1} bg="gray.900">
        <Flex h={'100%'} direction="column">
          <HStack p="2" mb={2}>
            <Avatar src={user.photoURL} name={user.name}></Avatar>
            <Spacer></Spacer>
            <Button onClick={getPin} colorScheme="teal" variant="solid">
              #{user.pin}
            </Button>
            <Spacer></Spacer>

            <Menu>
              <MenuButton as={Button} colorScheme="whitesmoke" variant="ghost">
                <SettingsIcon />
              </MenuButton>
              <MenuList color="black" bg="teal.600">
                <MenuItem _hover={{ bg: 'teal.500' }} onClick={onOpenDrawer} icon={<EditIcon />}>
                  {<DrawerProfile isOpen={isOpenDrawer} onOpen={onOpenDrawer} onClose={onCloseDrawer} />}
                  Edit Profile
                </MenuItem>
                <MenuItem _hover={{ bg: 'teal.500' }} onClick={logout} icon={<CloseIcon />}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <Divider></Divider>

          {arrayOfConversasValues.map((el, i) => (
            <VStack
              p={2}
              key={i}
              _hover={{ bg: 'gray.800' }}
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              align="stretch"
              onClick={() => setOnChat(arrayOfConversasKeys[i])}
              sx={onChat == arrayOfConversasKeys[i] ? { bg: 'gray.700', borderRight: '5px solid cyan' } : {}}
            >
              <Flex gap={2}>
                <Avatar src={el.photoURL} name={el.name}></Avatar>
                <Center>
                  <Text>{el.messages[el.messages.length - 1].body}</Text>
                </Center>
              </Flex>
            </VStack>
          ))}

          <Spacer></Spacer>

          {/* Modal add contact */}
          <Center>
            <Button leftIcon={<AddIcon />} colorScheme="teal" mb={2} onClick={onOpen}>
              Adicionar um contato
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="cyan.50">
                <ModalHeader>Adicionar pin...</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Center>
                    <HStack>
                      <Text fontSize="lg">#</Text>
                      <PinInput colorScheme="white" onChange={setPinToAdd} type="alphanumeric">
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                    </HStack>
                  </Center>
                </ModalBody>

                <ModalFooter>
                  <Center>
                    <Button onClick={() => addContact(pinToAdd, user.pin)} variant="solid" colorScheme="green">
                      Adicionar
                    </Button>
                  </Center>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Center>
        </Flex>
      </GridItem>

      {/* Messages */}
      <GridItem colSpan={3}>
        <Flex h="100%" direction="column" justify="space-between">
          <Flex h="90vh" overflowY="scroll" direction="column">
            {/* Messages */}
            {onChat ? (
              conversas[onChat].messages.map((el: { from: string; body: string }, i: number) => {
                // Trim used because there is a bug when it doesn't
                const isUser = el.from.trim() == user.uid.trim()
                return (
                  <Flex align="flex-end" justify={isUser ? 'flex-end' : 'flex-start'} key={i} w="100%" p={3} gap="5px">
                    {!isUser && <Avatar src={conversas[onChat].photoURL} name={conversas[onChat].name}></Avatar>}
                    <Box borderRadius="md" bg="green.600" p={5}>
                      <Text color="whitesmoke">{el.body}</Text>
                    </Box>
                  </Flex>
                )
              })
            ) : (
              <div>não há nada aqui</div>
            )}
            <div ref={anchorToScrollDownInSendMessage}></div>
          </Flex>
          <Flex p={2} gap={2} h="10vh" align="center">
            <Input
              color="whitesmoke"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite aqui...."
              size="lg"
            ></Input>
            <Button onClick={sendMessage} size="lg" colorScheme="blue">
              Send
            </Button>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default Home
