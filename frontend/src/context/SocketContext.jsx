import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// Export the context
export { SocketContext };

// Export the custom hook
export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket;
}

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        const newSocket = io('http://localhost:5001', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            path: '/socket.io',
            forceNew: true,
            upgrade: true,
            rememberUpgrade: true,
            secure: false,
            rejectUnauthorized: false
        });

        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
            setIsConnecting(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnecting(true);
            // Try to reconnect after a delay
            setTimeout(() => {
                if (newSocket.disconnected) {
                    newSocket.connect();
                }
            }, 5000);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnecting(true);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
                newSocket.close();
            }
        };
    }, []);

    if (isConnecting) {
        return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
                <p className="text-center">Connecting to server...</p>
                <p className="text-sm text-gray-500 mt-2">Please make sure the backend server is running</p>
            </div>
        </div>;
    }

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

// Export the provider as default
export default SocketProvider;
