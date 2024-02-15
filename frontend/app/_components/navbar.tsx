import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useScrollTop from '@/hooks/use-scroll'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false)
  const scrolled = useScrollTop();
  console.log(scrolled)
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
    setIsMounted(true)
    if (!socket) {
      return
    } else {
      socket.on('roomDoesNotExists', ({ joinroomId }: any) => {
        toast(`Room ${joinroomId} does not exists.`)
      })
      socket.on('roomExists', ({ roomId }: any) => {
        toast(`Room ${roomId} already exists.`)
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
  if (!isMounted) {
    return null
  }

  const createRoom = (e:any) => {
    e.preventDefault()
    if (roomId?.trim() !== '' && username?.trim() !== '' && socket) {
      socket.emit('createRoom', { roomId, username })
      console.log(`Room created: ${roomId} by user ${username}`)
      toast(`Room ${roomId} created`)

      router.push('/chat')
    }
  }
  const joinRoom = (e:any) => {
    e.preventDefault()
    if (joinroomId?.trim() !== '' && joinusername?.trim() !== '' && socket) {
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)
      socket.emit('joinRoom', { joinroomId, joinusername })
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)

      router.push('/chat')
    }
  }

  return (
    <div className={ ` ${scrolled ? "bg-gradient-to-r from-orange-100 to-oranage-200 opacity-100":""} z-20 fixed w-full h-16 flex justify-between items-center px-2 shadow-sm border-b-2 border-gray-400 `}>
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600 font-bold text-xl">
        TopAsk
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger>
            {' '}
            <Button className="px-6 py-2 rounded-md bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold transition duration-200  border-2 border-transparent hover:border-red-500">
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
              <DialogDescription>
                <div className=" ">
                  <form action="" className="flex flex-col gap-6 mt-10">
                    <input
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Your Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Room Name"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      onClick={createRoom}
                      className="px-8 py-2 rounded-md bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold transition duration-200  border-2 border-transparent hover:border-red-500"
                    >
                      Create Room
                    </button>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            {' '}
            <Button className="px-6 py-2 rounded-md bg-gradient-to-l from-orange-600 to-yellow-600 text-white font-bold transition duration-200  border-2 border-transparent hover:border-red-500">
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
              <DialogDescription>
                <div className=" ">
                  <form action="" className="flex flex-col gap-6 mt-10">
                    <input
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Your Name"
                      value={joinusername}
                      onChange={(e) => setJoinUsername(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Room Name"
                      value={joinroomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      onClick={joinRoom}
                      className="px-8 py-2 rounded-md bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold transition duration-200  border-2 border-transparent hover:border-red-500"
                    >
                      Join Room
                    </button>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Navbar
