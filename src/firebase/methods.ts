import { randomUUID } from 'crypto'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
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
  DocumentData,
} from 'firebase/firestore'

// Import of useSelector and UseDispatch, but with type of our store
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUser } from '../store/userSlice'
import { app, auth, db } from './index'

const SignUp = async (email: string, senha: string, displayName?: string, photoURL?: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, senha)

    // Pin do contato
    const pin = Math.floor(Math.random() * 100000).toString()

    if (!auth.currentUser) {
      return
    }

    // Save in firestore
    const userDoc = doc(db, 'users', auth.currentUser.uid)
    await setDoc(userDoc, {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      pin: pin,
      chats: {},
    })
    return { error: false, message: '' }
  } catch (err) {
    console.log('[ERRO] Sign Uo')
    throw err
  }
}

const SignIn = async (email: string, senha: string) => {
  try {
    const login = await signInWithEmailAndPassword(auth, email, senha)
  } catch (err) {
    console.log('[ERRO] Login')
    throw err
  }
}

const SignOut = async () => await auth.signOut()

const updateProfile = async (dades: { name: string; photoURL: string }) => {
  const { name, photoURL } = dades
  if (!auth.currentUser) {
    throw new Error('[UPDATE PROFILE] No user Authenticated')
  }

  const user = auth.currentUser.uid
  const userDoc = doc(db, 'users', user)
  await updateDoc(userDoc, {
    name: name || null,
    photoURL: photoURL || null,
  })
}

const getProfilePhotoOrNameUser = async (uid: string) => {
  const docUser = await getDoc(doc(db, 'users', uid))
  const dadesOfUser = docUser.data()
  console.log('dadesOfUser')
  console.log(dadesOfUser)

  if (!dadesOfUser) {
    return ''
  }

  return dadesOfUser.photoURL || dadesOfUser.name || 'Foi'
}

const getUserWithPin = async (pin: string): Promise<DocumentData> => {
  // Cria a query para extrair
  const q = query(collection(db, 'users'), where('pin', '==', pin))
  const dadesOfUser = await getDocs(q)

  // Salva o dado extraido e retorna
  let dades: DocumentData = {}
  dadesOfUser.forEach((doc) => {
    dades = doc.data()
  })

  return dades
}

const addContact = async (pinToAdd: string, pinAdding: string) => {
  if (!auth.currentUser) {
    throw new Error('[ADD CONTACT ERROR] No user Authenticated')
  }

  const whoAdd = await getUserWithPin(pinToAdd)
  const whoIsAdding = await getUserWithPin(pinAdding)
  console.log(whoAdd)

  if (!whoAdd || !whoIsAdding) {
    console.log('nao existe o contato')
    return 'nao existe o contato'
  }
  if (whoAdd.chats[whoIsAdding.uid] || whoIsAdding.chats[whoAdd.uid]) {
    return 'ja existe um chat'
  }

  // Save in firestore
  const user = auth.currentUser.uid
  const pinChat = Math.floor(Math.random() * 100000).toString()
  const chatDoc = doc(db, 'chats', pinChat)
  await setDoc(chatDoc, {
    messages: [{ body: 'hello', from: user }],
  })
  // Criação de um chat novo

  // Update no nosso contato

  // Set the "capital" field of the city 'DC'
  const userDocMe = doc(db, 'users', whoIsAdding.uid)
  await updateDoc(userDocMe, {
    chats: { ...whoIsAdding.chats, [whoAdd.uid]: pinChat },
  })

  // Update no contato adicionado
  const userDocHim = doc(db, 'users', whoAdd.uid)
  await updateDoc(userDocHim, {
    chats: { ...whoAdd.chats, [whoIsAdding.uid]: pinChat },
  })
}

const sendMessage = async (uidChat: string, message: { body: string; from: string }) => {
  const { body, from } = message
  const messageDoc = doc(db, 'chats', uidChat)
  await updateDoc(messageDoc, {
    messages: arrayUnion({ body, from }),
  })
}

export { SignIn, SignUp, SignOut, getUserWithPin, sendMessage, addContact, getProfilePhotoOrNameUser, updateProfile }
