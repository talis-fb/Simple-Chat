import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import {
  Center,
  Box,
  Button,
  ButtonGroup,
  Text,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
} from '@chakra-ui/react'

import firebaseConfig from '../../firebase-config.json'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { SignIn, SignUp } from '../firebase/methods'

const Home: NextPage = () => {
  const app = initializeApp(firebaseConfig)
  const toast = useToast()
  const toastError = (title: string, description: string) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 9000,
      isClosable: true,
    })
  }

  const [signInOrUp, setSignInOrUp] = useState(true)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senha2, setSenha2] = useState('')
  const changeEmail = (event) => setEmail(event.target.value)
  const changePassword = (event) => setSenha(event.target.value)
  const changePassword2 = (event) => setSenha2(event.target.value)

  const SignInForm = () => {
    return (
      <Flex direction="column" gap="8px">
        <FormControl>
          <FormLabel fontSize="lg">Email</FormLabel>
          <Input type="email" onChange={changeEmail} id="email"></Input>
          <FormErrorMessage>Insira um email válido</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input type="password" onChange={changePassword} id="password"></Input>
          <FormErrorMessage>Não caga com a senha não...</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          onClick={() => SignIn(email, senha).catch((e) => toastError('ERRO LOGIN', e.message))}
          colorScheme="blue"
        >
          Sign In
        </Button>
      </Flex>
    )
  }

  const SignUpForm = () => {
    const submit = () => {
      if (senha == senha2) {
        SignUp(email, senha).catch((e) => toastError('ERRO Sing Up', e.message))
      } else {
        toast({
          title: 'Senhas diferentes',
          description: 'Digite os mesmos valores de senha nos dois campos',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }

    return (
      <Flex direction="column" gap="8px">
        <FormControl>
          <FormLabel fontSize="lg">Email</FormLabel>
          <Input type="email" onChange={changeEmail} id="email"></Input>
          <FormErrorMessage>Insira um email válido</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input type="password" onChange={changePassword} id="password"></Input>
          <FormErrorMessage>Não caga com a senha não...</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Repita a Senha</FormLabel>
          <Input type="password" onChange={changePassword2} id="password"></Input>
          <FormErrorMessage>Não caga com a senha não...</FormErrorMessage>
        </FormControl>

        <Button type="submit" onClick={submit} colorScheme="blue">
          Sign Up
        </Button>
      </Flex>
    )
  }

  return (
    <Flex justify="center" align="center" gap="50px" color="whitesmoke" h="100vh" w="100vw" bg="gray.700">
      <Flex direction="column" gap="8px">
        {signInOrUp ? SignUpForm() : SignInForm()}

        <ButtonGroup isAttached>
          <Button onClick={() => setSignInOrUp(true)} variant={signInOrUp ? 'solid' : 'outline'} colorScheme="orange">
            Cadastrar-se
          </Button>
          <Button onClick={() => setSignInOrUp(false)} variant={signInOrUp ? 'outline' : 'solid'} colorScheme="orange">
            Login
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex direction="column" align="center" justify="center" gap="20px">
        <Heading maxW="25vw" textAlign="center">
          Bem vindo à um chat invocado!!
        </Heading>
        <Image
          width="200px"
          height="200px"
          src="https://media.tenor.com/images/3705aad154b22965c6723ac41e56415c/tenor.gif"
        ></Image>
      </Flex>
    </Flex>
  )
}

export default Home
