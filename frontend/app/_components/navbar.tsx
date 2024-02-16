import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import useScrollTop from '@/hooks/use-scroll'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

type CreateRoomFields = {
  roomId: string
  username: string
  delay?: number
  normal: number
  high: number
  veryHigh: number
}

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { register, handleSubmit } = useForm<CreateRoomFields>()
  const [isSlowModeEnabled, setIsSlowModeEnabled] = useState(false)
  const scrolled = useScrollTop()
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
    normalLimit,
    importantLimit,
    mILimit,
    setNormalLimit,
    setImportantLimit,
    setMILimit,
    slowMode,
    setSlowMode,
  } = useUserRoom()

  useEffect(() => {
    setIsMounted(true)
    if (!socket) {
      return
    } else {
      socket.on(
        'roomLimits',
        ({ normalLimit, importantLimit, mILimit, slowMode }: any) => {
          setNormalLimit(normalLimit)
          setImportantLimit(importantLimit)
          setMILimit(mILimit)
          setSlowMode(slowMode)
        },
      )

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

  const createRoom = (e: any) => {
    if (roomId?.trim() !== '' && username?.trim() !== '' && socket) {
      socket.emit('createRoom', {
        roomId,
        username,
        normalLimit,
        importantLimit,
        mILimit,
        slowMode,
      })
      console.log(
        `Room created: ${roomId} by user ${username} Delay- ${slowMode}`,
      )
      toast(`Room ${roomId} created`)

      router.push('/chat')
    }
  }
  const joinRoom = (e: any) => {
    e.preventDefault()
    if (joinroomId?.trim() !== '' && joinusername?.trim() !== '' && socket) {
      console.log(`Joining room: ${joinroomId} as user ${joinroomId}`)
      socket.emit('joinRoom', { joinroomId, joinusername })
      console.log(`Joining room: ${joinroomId} as user ${joinusername}`)

      router.push('/chat')
    }
  }

  return (
    <div
      className={` ${
        scrolled
          ? 'bg-gradient-to-r from-orange-100 to-oranage-200 opacity-100'
          : ''
      } z-20 fixed w-full h-16 flex justify-between items-center px-2 shadow-sm border-b-2 border-gray-400 `}
    >
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
                  <form
                    action=""
                    onSubmit={handleSubmit(createRoom)}
                    className="flex flex-col gap-6 mt-10"
                  >
                    <input
                      {...register('username', {
                        required: true,
                      })}
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Your Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      {...register('roomId', {
                        required: true,
                      })}
                      type="text"
                      className="h-8 p-1 rounded-md border-2 border-black"
                      placeholder="Room Name"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                    />
                    <div className=" w-full flex flex-col items-center justify-between border-2 border-gray-400 rounded-md px-2">
                      <div className="flex justify-between w-full items-center  py-5">
                        <div>Enable Slowmode?</div>
                        <Switch
                          onCheckedChange={() =>
                            setIsSlowModeEnabled(!isSlowModeEnabled)
                          }
                        />
                      </div>

                      <div>
                        {isSlowModeEnabled && (
                          <>
                            {' '}
                            <span>
                              Enter Time in seconds (10 seconds or what you
                              want)
                            </span>
                            <input
                              type="number"
                              {...register('delay', {
                                required: true,
                              })}
                              placeholder="1 or 10 seconds"
                              className="m-4 p-2 rounded-md border-2 border-black"
                              value={slowMode}
                              onChange={(e: any) => setSlowMode(e.target.value)}
                            />{' '}
                          </>
                        )}
                      </div>
                    </div>
                    <div className=" w-full flex flex-col items-start justify-center border-2 border-gray-400 rounded-md px-2">
                      <div className="text-black py-2 ">
                        Also set questions vote threshold
                      </div>
                      <div className="flex flex-col gap-3 mb-2">
                        <div className=" flex  items-start  justify-start   ">
                          <span className="text-blue-800"> Normal Limit-</span>
                          <input
                            {...register('normal', {
                              required: true,
                            })}
                            type="number"
                            value={normalLimit}
                            onChange={(e: any) =>
                              setNormalLimit(e.target.value)
                            }
                            className="border-2 border-blue-500 rounded-md ml-2 px-2 w-20"
                          />
                        </div>
                        <div className=" flex  items-start  justify-start  ">
                          <span className="text-yellow-800"> Important-</span>
                          <input
                            {...register('high', {
                              required: true,
                            })}
                            type="number"
                            value={importantLimit}
                            onChange={(e: any) =>
                              setImportantLimit(e.target.value)
                            }
                            className="border-2 border-yellow-500 rounded-md ml-2 px-2 w-20"
                          />
                        </div>{' '}
                        <div className=" flex  items-start  justify-start  ">
                          <span className="text-red-800"> Most Important-</span>
                          <input
                            {...register('veryHigh', {
                              required: true,
                            })}
                            type="number"
                            value={mILimit}
                            onChange={(e: any) => setMILimit(e.target.value)}
                            className="border-2 border-red-500 rounded-md ml-2 px-2 w-20"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
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
                  <form
                    action=""
                    onSubmit={joinRoom}
                    className="flex flex-col gap-6 mt-10"
                  >
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
