import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Derive socket URL from API URL if not explicitly provided
            const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3500/api';
            const socketUrl = apiBase.replace('/api', '');

            console.log('Connecting to socket at:', socketUrl);

            const newSocket = io(socketUrl, {
                withCredentials: true,
                transports: ['websocket', 'polling'] // Ensure compatibility
            });

            newSocket.on('connect', () => {
                console.log('✅ Connected to socket:', newSocket.id);
            });

            newSocket.on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err.message);
            });

            newSocket.on('user_online', (uid) => {
                const userId = uid._id || uid;
                setOnlineUsers((prev) => new Set([...prev, userId.toString()]));
            });

            newSocket.on('user_offline', (uid) => {
                const userId = uid._id || uid;
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(userId.toString());
                    return newSet;
                });
            });

            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
