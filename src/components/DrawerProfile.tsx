import { useEffect, useState, FC } from 'react'
import {
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
  Button,
  Image,
} from '@chakra-ui/react'

import { useAppSelector } from '../store/hooks'
import { updateProfile } from '../firebase/methods'
import { getUser } from '../store/userSlice'

interface IDrawer {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const DrawerProfile: FC<IDrawer> = ({ isOpen, onOpen, onClose }) => {
  // Get dades in store
  const user = useAppSelector(getUser)

  const [nameProfileSettings, setNameProfileSettings] = useState(user.name)
  const [photoProfileSettings, setPhotoProfileSettings] = useState(user.photoURL)

  // Update if the user dades change. This avoid it start with value empty because user is not loaded yet
  useEffect(() => {
    setNameProfileSettings(user.name)
    setPhotoProfileSettings(user.photoURL)
  }, [user])

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent color="whitesmoke" bg="gray.800">
        <DrawerCloseButton />
        <DrawerHeader>Ajeite o seu perfil...</DrawerHeader>

        <DrawerBody>
          <Input
            value={nameProfileSettings}
            onChange={(e) => setNameProfileSettings(e.target.value)}
            mb={5}
            placeholder="Name"
          />
          <Input
            value={photoProfileSettings}
            onChange={(e) => setPhotoProfileSettings(e.target.value)}
            placeholder="Url para a sua foto do perfil"
          />
          <Center mt={5} h="200px">
            <Image maxW="200px" borderRadius="full" fallbackSrc="" src={photoProfileSettings}></Image>
          </Center>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateProfile({ name: nameProfileSettings, photoURL: photoProfileSettings })
              onClose()
            }}
            colorScheme="blue"
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerProfile
