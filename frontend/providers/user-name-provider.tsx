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
  normalLimit: number;
  setNormalLimit: (normalLimit:number) => void;
  importantLimit: number;
  setImportantLimit: ( importantLimit:number) => void;
  mILimit: number;
  setMILimit: (mILimit:number) => void;
  slowMode: number;
  setSlowMode: (slowMode:number) => void;
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
  normalLimit: 0,
  setNormalLimit: () => {},
  importantLimit: 0,
  setImportantLimit:  () => {},
  mILimit: 0,
  setMILimit:  () => {},
  slowMode:0,
  setSlowMode:()=>{}
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
  const[normalLimit,setNormalLimit]=useState(2)
  const[importantLimit,setImportantLimit]=useState(3)
  const[mILimit,setMILimit]=useState(5)
  const[slowMode,setSlowMode]=useState(0)

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
        normalLimit,
        setNormalLimit,
        importantLimit,
        mILimit,
        setImportantLimit,
        setMILimit,
        slowMode,
        setSlowMode
      }}
    >
      {children}
    </UserRoomContext.Provider>
  )
}
