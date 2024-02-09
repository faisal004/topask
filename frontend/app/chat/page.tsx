'use client'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/providers/socket-provider'
import { useUserRoom } from '@/providers/user-name-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { SocketIndicator } from '@/components/socket-indicator'
interface Message {
  author: string;
  message: string;
  time: string;
  upvotes:[]
}
const ChatPage = () => {
  const { roomId, username } = useUserRoom()
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState<Message[]>([]);
  const { socket } = useSocket()
  const router = useRouter()
  useEffect(() => {
    if (!socket) {
      router.push('/')
    }
    if (roomId === null || username === null) {
      router.push('/')
    }
  }, [roomId, username, socket, router])
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

      await socket.emit('send_message', messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', handleMessageReceived)

      return () => {
        socket.off('receive_message', handleMessageReceived)
      }
    }
  }, [socket])

  const handleMessageReceived = (data: any) => {
    setMessageList((list) => [...list, data])
  }
  return (
   
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="relative flex flex-col items-center  ">
        <div className='h-full  w-full overflow-y-auto pb-14 pt-2 flex flex-col gap-2 '>
            {messageList.map((message, index) => (
             <Card className="w-full max-w-sm mx-auto border-2 border-gray-500 " key={index}>
             <CardContent className="flex flex-col gap-2 p-4">
               <p className="text-sm">{message.message}</p>
               <Button className="ml-auto" size="sm">
                 Upvote
               </Button>
             </CardContent>
             <CardFooter className="flex flex-col gap-1 p-4 border-t border-gray-400">
               <p className="text-sm flex items-center gap-2">
                
                 <span>{message.author}</span>
               </p>
               <p className="text-xs text-gray-500">{message.time}</p>
             </CardFooter>
           </Card>
            ))}
          </div>
          <div className="absolute bottom-0 py-3  ">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                value={currentMessage}
                placeholder="send you question"
                onChange={(e) => {
                  setCurrentMessage(e.target.value)
                }}
                className='h-8 '
              />
             
              <div>
              <Button onClick={sendMessage} type="submit" className='relative'>
                Send
              </Button>
              <div className='absolute top-9 -right-2 border-white border-2 rounded-full '>
              <SocketIndicator/>
              </div>
             
              </div>
            
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Two</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Three</ResizablePanel>
      </ResizablePanelGroup>

    
  )
}

export default ChatPage
