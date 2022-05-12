import type { Component } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Firebase
import firebaseConfig from '../../firebase-config.json'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import { SignIn, SignUp, SignOut, getUserWithPin } from './methods'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUser } from '../store/userSlice'
import { randomUUID } from 'crypto'

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore(app)

export { app, auth, db }
