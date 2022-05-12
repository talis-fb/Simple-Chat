import type { Component } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Firebase
import firebaseConfig from '../../firebase-config.json'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import { SignIn, SignUp, SignOut } from './methods'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUser } from '../store/userSlice'
import { randomUUID } from 'crypto'
import { app, auth } from './index'

const FirebaseProvider = ({ children }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const db = getFirestore(app)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (router.route == '/') {
          router.push('/chat')
        }

        // Get the document with the dades of user in firestone
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        const docDades = docSnap.data()

        dispatch(updateUser({ ...user, pin: docDades ? docDades.pin : '' }))
      } else {
        router.push('/')
        if (router.route == '/chat') {
          router.push('/')
        }
      }
    })
  }, [])

  return children
}

export default FirebaseProvider
