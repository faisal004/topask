'use client'

import { useSocket } from '@/providers/socket-provider'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'

// interface Message {
//   id: string
//   message: string
//   upvotes: number
//   roomId: string
// }

export default function Home() {
  const { socket } = useSocket()
  const router = useRouter()
  const {
    username,
    roomId,
    setRoomId,
    setUsername,
    setJoinRoomId,
    setJoinUsername,
    joinroomId,
    joinusername,
    roomCreator,
    setRoomCreator,
    setCurrentSocketId,
    currentSocketId,
  } = useUserRoom()

  useEffect(() => {
    if (!socket) {
      return
    } else {
      socket.on('roomDoesNotExists', ({ joinroomId }: any) => {
        alert(`Room ${joinroomId} does not exists.`)
      })
      socket.on('roomExists', ({ roomId }: any) => {
        alert(`Room ${roomId} already exists.`)
      })
      socket.on('roomCreated', ({ username, creatorSocketId }: any) => {
        setRoomCreator(username)
        setCurrentSocketId(creatorSocketId)
      })
    }

    return () => {
      if (socket) {
        socket.off('roomCreated')
        socket.off('roomExists')
      }
    }
  }, [socket])
  const createRoom = () => {
    if (roomId?.trim() !== '' && username?.trim() !== '' && socket) {
      socket.emit('createRoom', { roomId, username })
      console.log(`Room created: ${roomId} by user ${username}`)

      //handle the case if room exist show alert for now
      router.push('/chat')
    }
  }

  const joinRoom = () => {
    if (joinroomId?.trim() !== '' && joinusername?.trim() !== '' && socket) {
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)
      socket.emit('joinRoom', { joinroomId, joinusername })
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)

      router.push('/chat')
    }
  }

  return (
    <div className="flex  gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-3 bg-gray-400 p-2">
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
      <div className="flex flex-col gap-3 bg-gray-400 p-2">
        <input
          type="text"
          placeholder="Your Name"
          value={joinusername}
          onChange={(e) => setJoinUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={joinroomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  )
}
