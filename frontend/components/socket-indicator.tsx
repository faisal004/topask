"use client";


import { useSocket } from "@/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
        <div
     
        className="bg-emerald-600 text-white border-none rounded-full h-5 w-6"
      >
        
      </div>
    )
  }

  return (
    <div
     
      className="bg-emerald-600 text-white border-none rounded-full h-5 w-5 "
    >
      
    </div>
  )
}