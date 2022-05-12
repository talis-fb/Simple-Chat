import type { Component } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Firebase
import firebaseConfig from '../../firebase-config.json'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUser } from '../store/userSlice'
import store from '../store/store'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore(app)

// Sincronizacao com os dados do Usuario sno firebase em tempor real
let userFinishSync = () => {}
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('user')
    console.log(user)
    userFinishSync()
    userFinishSync = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const newDades = doc.data()
      store.dispatch({ type: 'user/updateUser', payload: { ...newDades, uid: user.uid } })
      console.log('DADES OF USER CHANGE')
      console.log(newDades)
    })
  }
})
