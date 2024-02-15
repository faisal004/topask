import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SocketProvider } from '@/providers/socket-provider'
import { UserRoomProvider } from '@/providers/user-name-provider'
import { Toaster } from '@/components/ui/sonner'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Top Ask',
  description: 'Where important question take center stage',
  icons: {
    icon: [
      {
        url: '/t.svg',
        href: '/t.svg',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          <UserRoomProvider>
            {children}
            <Toaster />
          </UserRoomProvider>
        </SocketProvider>
      </body>
    </html>
  )
}
