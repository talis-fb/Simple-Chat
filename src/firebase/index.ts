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
const syncUserStoreWithFirestore = (user) => {
  console.log('SYNC USER DISPARADO')
  userFinishSync()
  userFinishSync = onSnapshot(doc(db, 'users', user.uid), (doc) => {
    const newDades = doc.data()
    store.dispatch({ type: 'user/updateUser', payload: { ...newDades, uid: user.uid } })
  })
}

let chatFinishSync = () => {}
const syncChatStoreWithFirestore = (user) => {
  console.log('SYNC CHAT DISPARADO')
  chatFinishSync()
  chatFinishSync = onSnapshot(doc(db, 'users', user.uid), (docReturned) => {
    const allChats = docReturned.data().chats
    const uidContactsOfChats = Object.keys(allChats)
    const uidChats = Object.values(allChats)

    uidChats.forEach((chatUid, i) => {
      onSnapshot(doc(db, 'chats', chatUid), (docReturned) => {
        const allMessages = docReturned.data().messages
        store.dispatch({
          type: 'chats/setNewConversation',
          payload: {
            uid: chatUid,
            name: uidContactsOfChats[i],
            messages: allMessages,
          },
        })
      })
    })
  })
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    syncUserStoreWithFirestore(user)
    syncChatStoreWithFirestore(user)
  } else {
    console.log('onAuthStateChanged sem user')
  }
})
