'use client'

import { useSocket } from '@/providers/socket-provider'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  message: string
  upvotes: number
  roomId: string
}

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
  const [message, setMessage] = useState<string>('')
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!socket) {
      return
    } else {
      socket.on('roomExists', ({ roomId }: any) => {
        alert(`Room ${roomId} already exists.`)
      })
      socket.on('roomCreated', ({ username, creatorSocketId }: any) => {
        setRoomCreator(username)
        setCurrentSocketId(creatorSocketId)
      })

      socket.on('message', (receivedMessage: Message) => {
        const existingMessageIndex = receivedMessages.findIndex(
          (msg) => msg.id === receivedMessage.id,
        )

        if (existingMessageIndex !== -1) {
          const updatedMessages = [...receivedMessages]
          updatedMessages[existingMessageIndex].upvotes =
            receivedMessage.upvotes
          setReceivedMessages(updatedMessages)
        } else {
          setReceivedMessages((prevMessages) => [
            ...prevMessages,
            receivedMessage,
          ])
        }
      })
    }

    return () => {
      if (socket) {
        socket.off('message')
        socket.off('roomCreated')
      }
    }
  }, [socket, receivedMessages])
  const createRoom = () => {
    if (roomId?.trim() !== '' && username?.trim() !== '' && socket) {
      socket.emit('createRoom', { roomId, username })
      console.log(`Room created: ${roomId} by user ${username}`)
      setRoomId('')
      setUsername('')
      //handle the case if room exist show alert for now
      router.push('/chat')
    }
  }

  const joinRoom = () => {
    if (joinroomId?.trim() !== '' && joinusername?.trim() !== '' && socket) {
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)
      socket.emit('joinRoom', { joinroomId, joinusername })
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)
      setRoomId('')
    }
  }
  const sendMessage = () => {
    if (message.trim() !== '' && socket) {
      socket.emit('message', {
        id: uuidv4(),
        message,
        upvotes: 0,
        roomId: joinroomId,
      })
      setMessage('')
    }
  }

  const handleUpvote = (id: string) => {
    if (socket && !votedIds.has(id)) {
      socket.emit('upvote', id)
      setVotedIds((prevIds) => new Set(prevIds.add(id)))
    }
  }

  const sortedMessages = receivedMessages.sort((a, b) => b.upvotes - a.upvotes)
  const isRoomCreator = currentSocketId === (socket && socket.id)
  return (
    <div className="flex  gap-4 items-center justify-center h-full">
      <div>
        <p>Room Creator: {roomCreator}</p>
        {isRoomCreator && <p>You are the room creator.</p>}
      </div>
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
      <div>
        {sortedMessages.map((msg) => (
          <div key={msg.id}>
            <div>{msg.message}</div>
            <div>Upvotes: {msg.upvotes}</div>
            <button onClick={() => handleUpvote(msg.id)}>Upvote</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
