import { useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'

// Firebase
import { auth } from './index'
import { onAuthStateChanged } from 'firebase/auth'

const FirebaseProvider = ({ children }: { children: ReactElement }) => {
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(router.route)
        if (router.route == '/' || !router.route) {
          router.push('/chat')
        }
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
