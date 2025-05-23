import { io } from 'socket.io-client'

let socket

export const initSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
            token: localStorage.getItem('token')
        }
    })
    return socket
}

export const getSocket = () => socket