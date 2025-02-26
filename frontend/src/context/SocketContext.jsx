import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
                newSocket.close();
            }
        };
    }, []);

    if (!socket) {
        return <div>Connecting to server...</div>;
    }

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;