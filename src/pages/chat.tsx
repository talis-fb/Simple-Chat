import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import {
  ChakraProvider,
  Center,
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
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
} from '@chakra-ui/react'

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebase-config.json'

const Home: NextPage = () => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth()
  const [isOpen, setOpen] = useState(0)
  const onOpen = () => setOpen(1)
  const onClose = () => setOpen(0)

  const conversas_example = [
    { body: 'Opa', from: 1 },
    { body: 'Opa', from: 1 },
    { body: 'Opa', from: 2 },
    { body: 'Opa', from: 2 },
    { body: 'Opa', from: 1 },
    { body: 'Opa', from: 1 },
    { body: 'Opa', from: 1 },
    { body: 'Opa', from: 1 },
  ]

  const logout = () => {
    auth.signOut()
  }

  const { hasCopied, onCopy } = useClipboard('1232d21')
  const toast = useToast()
  const getPin = (ev) => {
    onCopy()
    toast({
      title: 'PIN copiado',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  return (
    <Grid bg="red" h={'100vh'} templateColumns="repeat(4, 1fr)">
      <GridItem colSpan={1} bg="tomato">
        <Flex h={'100%'} direction="column">
          <HStack>
            <Avatar name="Talison Fabio"></Avatar>
            <Spacer></Spacer>
            <Button onClick={getPin} colorScheme="teal" variant="solid">
              #dkfsadas
            </Button>
            <Spacer></Spacer>

            <Menu>
              <MenuButton as={Button} colorScheme="red" variant="ghost">
                <HamburgerIcon />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logout} icon={<CloseIcon />}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <Divider></Divider>

          <VStack
            _hover={{ backgroundColor: 'red' }}
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <Flex p={1}>
              <Avatar name="Gustavo Freire"></Avatar>
              <Center>
                <Text>Eis aqui uma mensagem random</Text>
              </Center>
            </Flex>
          </VStack>

          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
            <Flex p={1}>
              <Avatar name="Gustavo Freire"></Avatar>
              <Center>
                <Text>Eis aqui uma mensagem random</Text>
              </Center>
            </Flex>
          </VStack>

          <Spacer></Spacer>

          {/* Modal add contact */}
          <Center>
            <Button onClick={onOpen}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Adicionr pin...</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Center>
                    <HStack>
                      <Text>#</Text>
                      <PinInput type="alphanumeric">
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
                    <Button variant="solid" colorScheme="green">
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
      <GridItem colSpan={3} bg="papayawhip">
        <Flex direction="column-reverse">
          {/* Messages */}
          {conversas_example.map((el, i) => {
            const isUser = i == 1
            return (
              <Flex align="flex-end" justify={isUser && 'flex-end'} key={i} w="100%" p={3} gap="5px" bg="blue">
                {!isUser && <Avatar name="Talison Fabio"></Avatar>}
                <Box borderRadius="md" bg="orange" p={5}>
                  <Text>{el.body}</Text>
                </Box>
              </Flex>
            )
          })}
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default Home
