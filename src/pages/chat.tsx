import type { NextPage } from 'next'
import { useState } from 'react'
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
  Textarea,
} from '@chakra-ui/react'
import { CloseIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons'

import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebase-config.json'
import { sendMessage as submitMessageFirestore, addContact, getProfilePhotoOrNameUser } from '../firebase/methods'

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

const Home: NextPage = () => {
  // store
  const user = useAppSelector(getUser)

  // Hooks
  const dispatch = useAppDispatch()
  const app = initializeApp(firebaseConfig)
  const auth = getAuth()
  const [isOpen, setOpen] = useState(0)
  const onOpen = () => setOpen(1)
  const onClose = () => setOpen(0)

  // Manage of chats
  const [openChat, setOpenChat] = useState<string>('main')
  const conversas = useAppSelector(selectAllChat)
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
  const getPin = (ev) => {
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
  const sendMessage = () => {
    submitMessageFirestore(conversas[onChat].uid, { body: text, from: user.uid })
    setText('')
  }

  return (
    <Grid bg="gray.800" h={'100vh'} templateColumns="repeat(4, 1fr)">
      <GridItem color="white" colSpan={1} bg="gray.900">
        <Flex h={'100%'} direction="column">
          <HStack p="2" mb={2}>
            <Avatar name={user.name}></Avatar>
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
                <MenuItem _hover={{ bg: 'teal.500' }} onClick={logout} icon={<EditIcon />}>
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
              sx={onChat == arrayOfConversasKeys[i] && { bg: 'gray.700', borderRight: '5px solid cyan' }}
            >
              <Flex gap={2}>
                <Avatar name={el.name}></Avatar>
                <Center>
                  <Text>{el.messages[el.messages.length - 1].body}</Text>
                </Center>
              </Flex>
            </VStack>
          ))}

          <Spacer></Spacer>

          {/* Modal add contact */}
          <Center>
            <Button colorScheme="teal" mb={2} onClick={onOpen}>
              Open Modal
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="cyan.50">
                <ModalHeader>Adicionr pin...</ModalHeader>
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
          <Flex maxH="90vh" overflowY="scroll" direction="column">
            {/* Messages */}
            {conversas[onChat].messages.map((el, i) => {
              const isUser = el.from == user.pin
              return (
                <Flex align="flex-end" justify={isUser && 'flex-end'} key={i} w="100%" p={3} gap="5px">
                  {!isUser && <Avatar name={el.from}></Avatar>}
                  <Box borderRadius="md" bg="green.600" p={5}>
                    <Text color="whitesmoke">{el.body}</Text>
                  </Box>
                </Flex>
              )
            })}
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
