"use client"

import { createContext,useContext,useEffect,useState } from "react";
import * as io from 'socket.io-client'

type SocketContextType={
    socket:any|null;
    isConnected:boolean;
}

const SocketContext= createContext<SocketContextType>({
    socket:null,
    isConnected:false
})

export const useSocket=()=>{
    return useContext(SocketContext)
}
export const SocketProvider=({children}:{children:React.ReactNode})=>{
    const [socket, setSocket] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(()=>{
        const socketInstance = io.connect(process.env.NEXT_PUBLIC_API_URL!)

        socketInstance.on('connect', () => {
            console.log('Connected to server');
            setSocket(socketInstance);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            socketInstance.disconnect();
        };
    },[])
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}