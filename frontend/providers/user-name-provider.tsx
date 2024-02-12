'use client'
import React, { createContext, useContext, useState } from 'react'

type UserRoomContextType = {
  username: string | null
  roomId: string | null
  setUsername: (username: string) => void
  setRoomId: (roomId: string) => void
  joinusername: string | null
  joinroomId: string | null
  setJoinUsername: (username: string) => void
  setJoinRoomId: (roomId: string) => void
  roomCreator: string;
  setRoomCreator: (creator: string) => void;
  currentSocketId: string;
  setCurrentSocketId: (socketId: string) => void;
}

const UserRoomContext = createContext<UserRoomContextType>({
  username: null,
  roomId: null,
  setUsername: () => {},
  setRoomId: () => {},
  joinusername: null,
  joinroomId: null,
  setJoinUsername: () => {},
  setJoinRoomId: () => {},
  roomCreator: '',
  setRoomCreator: () => {},
  currentSocketId: '',
  setCurrentSocketId: () => {},
})
export const useUserRoom = () => useContext(UserRoomContext)

export const UserRoomProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [username, setUsername] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [joinusername, setJoinUsername] = useState<string | null>(null)
  const [joinroomId, setJoinRoomId] = useState<string | null>(null)
  const [roomCreator, setRoomCreator] = useState('')
  const [currentSocketId, setCurrentSocketId] = useState('')

  return (
    <UserRoomContext.Provider
      value={{
        username,
        roomId,
        setUsername,
        setRoomId,
        joinusername,
        joinroomId,
        setJoinUsername,
        setJoinRoomId,
        roomCreator,
        setRoomCreator,
        currentSocketId,
        setCurrentSocketId,
      }}
    >
      {children}
    </UserRoomContext.Provider>
  )
}
