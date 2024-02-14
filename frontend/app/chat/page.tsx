'use client'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
interface Message {
  id: string
  message: string
  upvotes: number
  roomId: string
}

const ChatPage = () => {
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
      }
    }
  }, [socket, receivedMessages, roomId, username, joinroomId])
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
    <div>
      <div>{isRoomCreator && <p>{roomCreator} is room creator</p>}</div>
      <div>
        {sortedMessages.map((msg) => (
          <div key={msg.id}>
            <div>{msg.message}</div>
            <div>Upvotes: {msg.upvotes}</div>
            <button onClick={() => handleUpvote(msg.id)}>Upvote</button>
          </div>
        ))}
      </div>
      {!roomCreator ? (
        <>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>{' '}
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default ChatPage
