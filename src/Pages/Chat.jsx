import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { FiSend, FiArrowLeft, FiMoreVertical, FiImage, FiSmile, FiPaperclip } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './Chat.css';

const Chat = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const { socket, onlineUsers } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const [userRes, msgRes] = await Promise.all([
                    axiosInstance.get(`/user/${userId}`),
                    axiosInstance.get(`/chat/messages/${userId}`)
                ]);
                setOtherUser(userRes.data);
                setMessages(msgRes.data);

                // Mark as read
                await axiosInstance.put(`/chat/read/${userId}`);
            } catch (err) {
                console.error('Failed to fetch chat data:', err);
            }
        };
        fetchChatData();
    }, [userId]);

    useEffect(() => {
        if (socket) {
            socket.emit('join_chat', userId);

            socket.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            socket.on('user_typing', (data) => {
                if (data.userId === userId) {
                    setOtherUserTyping(data.isTyping);
                }
            });

            return () => {
                socket.off('receive_message');
                socket.off('user_typing');
            };
        }
    }, [socket, userId]);

    useEffect(scrollToBottom, [messages, otherUserTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('send_message', {
            recipientId: userId,
            content: newMessage
        });

        // Optimistic UI update could be added here, but let's rely on socket for now
        setNewMessage('');
        socket.emit('typing', { recipientId: userId, isTyping: false });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { recipientId: userId, isTyping: true });
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing', { recipientId: userId, isTyping: false });
        }, 2000);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-window-v2">
            <div className="chat-main-container">
                <header className="chat-header-v2">
                    <div className="header-left">
                        <Link to="/network/all" className="back-link"><FiArrowLeft /></Link>
                        <div className="user-status-wrapper">
                            <img
                                src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name || 'User'}&background=random`}
                                alt=""
                                className="header-avatar"
                            />
                            {onlineUsers.has(userId) && <span className="online-dot"></span>}
                        </div>
                        <div className="header-user-meta">
                            <h3>{otherUser?.name}</h3>
                            <p className={onlineUsers.has(userId) ? 'online' : ''}>
                                {otherUserTyping ? 'typing...' : (onlineUsers.has(userId) ? 'Online' : 'Offline')}
                            </p>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="icon-btn"><FiMoreVertical /></button>
                    </div>
                </header>

                <div className="chat-messages-area">
                    <div className="date-separator"><span>Today</span></div>

                    {messages.map((msg, index) => {
                        const isMine = msg.sender === user?._id || msg.sender?._id === user?._id;
                        return (
                            <motion.div
                                key={msg._id || index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}
                            >
                                <div className="bubble-content">
                                    <p>{msg.content}</p>
                                    <span className="bubble-time">{formatTime(msg.createdAt)}</span>
                                </div>
                            </motion.div>
                        );
                    })}

                    <AnimatePresence>
                        {otherUserTyping && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="chat-bubble-wrapper theirs"
                            >
                                <div className="typing-bubble">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                <footer className="chat-footer-v2">
                    <div className="input-toolbar">
                        <button className="toolbar-btn"><FiSmile /></button>
                        <button className="toolbar-btn"><FiPaperclip /></button>
                        <button className="toolbar-btn"><FiImage /></button>
                    </div>
                    <form className="chat-form-v2" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Write a message..."
                            value={newMessage}
                            onChange={handleTyping}
                        />
                        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                            <FiSend />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default Chat;
