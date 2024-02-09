'use client'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ChatPage = () => {
  const { roomId, username } = useUserRoom()
  const [currentMessage, setCurrentMessage] = useState('')
  const { socket } = useSocket()
  const router = useRouter()
  useEffect(() => {
    if (!socket) {
      router.push('/')
    }
    if (roomId === null || username === null) {
      router.push('/')
    }
  }, [roomId, username, socket,router])
  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: roomId,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      }

      await socket.emit("send_message",messageData)
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data: any) => {
        console.log(data)
      })
    }
  }, [socket])
  return (
    <div>
      Chat page
      <div className="text-white flex flex-col ">
        <div> {username}</div>
        <div>{roomId}</div>
        <input
          type="text"
          placeholder="send you question"
          onChange={(e) => {
            setCurrentMessage(e.target.value)
          }}
        />
        <button onClick={sendMessage}>send</button>
      </div>
    </div>
  )
}

export default ChatPage
