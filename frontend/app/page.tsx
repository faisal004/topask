'use client'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/providers/socket-provider'
import {  useUserRoom } from '@/providers/user-name-provider'

export default function Home() {
  const { setUsername, roomId, username, setRoomId } = useUserRoom()
  const router = useRouter()
  const { socket } = useSocket()

  const joinRoom = () => {
    if (username !== '' && roomId !== '') {
      socket.emit('join_room', roomId)
      router.push('/chat')
    }

  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div>Joit a room</div>
      <input
        type="text"
        placeholder="Name..."
        onChange={(e) => {
          setUsername(e.target.value)
        }}
      />
      <input
        type="text"
        placeholder="roomID"
        onChange={(e) => {
          setRoomId(e.target.value)
        }}
      />
      <button onClick={joinRoom}>join the room</button>
    </div>
  )
}
