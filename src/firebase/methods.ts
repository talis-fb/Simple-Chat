import { randomUUID } from 'crypto'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
} from 'firebase/firestore'

// Import of useSelector and UseDispatch, but with type of our store
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUser } from '../store/userSlice'
import { app, auth, db } from './index'

const SignUp = async (email: string, senha: string, displayName?: string, photoURL?: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, senha)
    // await updateProfile(auth.currentUser, {
    //   displayName,
    //   photoURL,
    // })

    // Pin do contato
    const pin = Math.floor(Math.random() * 100000).toString()

    // Save in firestore
    const userDoc = doc(db, 'users', auth.currentUser.uid)
    await setDoc(userDoc, {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      pin: pin,
      chats: {},
    })
  } catch (err) {
    console.log('ERRUUUUUUUUU no login')
    console.log(err)
    return err
  }
}

const SignIn = (email: string, senha: string) => {}

const SignOut = async () => await auth.signOut()

const getUserWithPin = async (pin: string) => {
  // Cria a query para extrair
  const q = query(collection(db, 'users'), where('pin', '==', pin))
  const dadesOfUser = await getDocs(q)

  // Salva o dado extraido e retorna
  let dades = null
  dadesOfUser.forEach((doc) => {
    dades = doc.data()
  })

  return dades
}

const sendMessage = async (uidChat: string, message: { body: string; from: string }) => {
  const { body, from } = message
  const messageDoc = doc(db, 'chats', uidChat)

  // Atomically add a new region to the "regions" array field.
  await updateDoc(messageDoc, {
    messages: arrayUnion({ body, from }),
  })
}

export { SignIn, SignUp, SignOut, getUserWithPin, sendMessage }
