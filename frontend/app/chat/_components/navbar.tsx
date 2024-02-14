'use client'
import { ArrowBigUp, MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
interface Message {
  id: string
  author: string
  message: string
  upvotes: number
  roomId: string
  answered: Boolean
}

const Navbar = ({ name, messages }: { name: string; messages: Message[] }) => {
  console.log('faisal', { messages })
  return (
    <div className="bg-gradient-to-r from-gray-300 to-gray-400 font-semibold fixed w-full h-10 z-10 flex items-center justify-between px-2">
      <div className="text-black">{name}</div>

      <Sheet>
        <SheetTrigger>
          <MenuIcon className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent className='overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>Answered</SheetTitle>
            <SheetDescription className="flex flex-col gap-3 overflow-auto">
              {messages.map((message, index) => (
                <Card
                  className="w-full max-w-sm mx-auto border-2 border-gray-500 bg-gradient-to-b from-green-400 to-green-500 font-semibold "
                  key={message.id}
                >
                  <CardContent className="flex flex-col h-20 gap-2 p-4">
                    <p className="text-sm">{message.message}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-1 p-4 border-t border-gray-400">
                    <p className="text-sm flex items-center justify-between  w-full gap-2">
                      <span>{message.author}</span>
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Navbar