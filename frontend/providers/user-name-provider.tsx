"use client"
import React, { createContext, useContext, useState } from "react";

type UserRoomContextType = {
    username: string | null;
    roomId: string | null;
    setUsername: (username: string) => void;
    setRoomId: (roomId: string) => void;
}

const UserRoomContext = createContext<UserRoomContextType>({
    username: null,
    roomId: null,
    setUsername: () => {},
    setRoomId: () => {}
});

export const useUserRoom = () => useContext(UserRoomContext);

export const UserRoomProvider = ({ children }:{children:React.ReactNode}) => {
    const [username, setUsername] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);

    return (
        <UserRoomContext.Provider value={{ username, roomId, setUsername, setRoomId }}>
            {children}
        </UserRoomContext.Provider>
    );
};
