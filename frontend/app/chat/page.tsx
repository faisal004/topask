'use client'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SocketIndicator } from '@/components/socket-indicator'
import { ArrowBigUp, CheckCheck } from 'lucide-react'
import Navbar from './_components/navbar'
interface Message {
  id: string
  author: string
  message: string
  upvotes: number
  roomId: string
  answered: Boolean
}

const ChatPage = () => {
  const { socket } = useSocket()
  const router = useRouter()
  const {
    username,
    roomId,

    joinroomId,
    joinusername,
    roomCreator,

    currentSocketId,
  } = useUserRoom()
  const [message, setMessage] = useState<string>('')
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [isInputDisabled, setIsInputDisabled] = useState(false)
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
          updatedMessages[existingMessageIndex].answered =
            receivedMessage.answered
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
      setIsInputDisabled(true)
      socket.emit('message', {
        id: uuidv4(),
        message,
        author: joinusername,
        upvotes: 0,
        roomId: joinroomId,
        answered: false,
      })
      setMessage('')
      setTimeout(() => {
        setIsInputDisabled(false)
      }, 6000)
    }
  }

  const handleUpvote = (id: string) => {
    if (socket && !votedIds.has(id)) {
      socket.emit('upvote', id)
      setVotedIds((prevIds) => new Set(prevIds.add(id)))
    }
  }
  const handleAnswered = (id: string) => {
    if (socket) {
      socket.emit('answered', id)
      const updatedMessages = receivedMessages.map((msg) => {
        if (msg.id === id) {
          return { ...msg, answered: true }
        } else {
          return msg
        }
      })
      setReceivedMessages(updatedMessages)
    }
  }

  const sortedMessages = receivedMessages.sort((a, b) => b.upvotes - a.upvotes)
  const answered = sortedMessages.filter((msg) => msg.answered == true)
  console.log(answered)
  const normal = sortedMessages.filter(
    (msg) => msg.upvotes <= 2 && msg.answered == false,
  )
  const highUpvotes = sortedMessages.filter(
    (msg) => msg.upvotes > 2 && msg.upvotes <= 3 && msg.answered == false,
  )
  const veryHighUpvotes = sortedMessages.filter(
    (msg) => msg.upvotes > 3 && msg.answered == false,
  )
  const isRoomCreator = currentSocketId === (socket && socket.id)
  return (
    <div className="h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <Navbar name={roomCreator || joinusername} messages={answered} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="relative flex flex-col items-center  ">
          <div className="h-full  w-full overflow-y-auto pb-14 pt-12 flex flex-col gap-2 ">
            {normal.map((message, index) => (
              <Card
                className="w-full max-w-sm mx-auto border-2 border-gray-500 bg-gradient-to-b from-blue-400 to-blue-500 font-semibold "
                key={message.id}
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="text-sm">{message.message}</p>
                  <Button
                    onClick={() => handleUpvote(message.id)}
                    className="ml-auto"
                    size="sm"
                  >
                    <ArrowBigUp className="fill-white" /> {message.upvotes}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-1 p-4 border-t border-gray-400">
                  <p className="text-sm flex items-center justify-between  w-full gap-2">
                    <span>{message.author}</span>
                    {isRoomCreator ? (
                      <span
                        className=""
                        onClick={() => handleAnswered(message.id)}
                      >
                        <CheckCheck className="hover:text-green-400 cursor-pointer" />
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                  <div> </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {!isRoomCreator ? (
            <>
              <div className="absolute bottom-0 py-3  ">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    disabled={isInputDisabled}
                    value={message}
                    placeholder="send you question"
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-8 "
                  />

                  <div>
                    <Button
                      onClick={sendMessage}
                      type="submit"
                      className="relative"
                      disabled={isInputDisabled}
                    >
                      Send
                    </Button>
                    <div className="absolute top-9 -right-2 border-white border-2 rounded-full ">
                      <SocketIndicator />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ''
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full  w-full overflow-y-auto pb-14 pt-12 flex flex-col gap-2 ">
            {highUpvotes.map((message, index) => (
              <Card
                className="w-full max-w-sm mx-auto border-2 border-gray-500 bg-gradient-to-b from-yellow-400 to-yellow-500 font-semibold "
                key={message.id}
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="text-sm">{message.message}</p>
                  <Button
                    onClick={() => handleUpvote(message.id)}
                    className="ml-auto"
                    size="sm"
                  >
                    <ArrowBigUp className="fill-white" /> {message.upvotes}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-1 p-4 border-t border-gray-400 ">
                  <p className="text-sm flex items-center justify-between  w-full gap-2">
                    <span>{message.author}</span>
                    {isRoomCreator ? (
                      <span className="">
                        <CheckCheck className="hover:text-green-400 cursor-pointer" />
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                  {/* <p className="text-xs text-gray-500">{message.time}</p> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full  w-full overflow-y-auto pb-14 pt-12 flex flex-col gap-2 ">
            {veryHighUpvotes.map((message, index) => (
              <Card
                className="w-full max-w-sm mx-auto border-2 border-gray-500 bg-gradient-to-b from-red-400 to-red-500 font-semibold"
                key={message.id}
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="text-sm">{message.message}</p>
                  <Button
                    onClick={() => handleUpvote(message.id)}
                    className="ml-auto"
                    size="sm"
                  >
                    <ArrowBigUp className="fill-white" /> {message.upvotes}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-1 p-4 border-t border-gray-400">
                  <p className="text-sm flex items-center justify-between w-full gap-2">
                    <span>{message.author}</span>
                    {isRoomCreator ? (
                      <span className="">
                        <CheckCheck className="hover:text-green-400 cursor-pointer" />
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                  {/* <p className="text-xs text-gray-500">{message.time}</p> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ChatPage
