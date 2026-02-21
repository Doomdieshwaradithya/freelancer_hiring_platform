import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext.jsx'
import { getConversations, getConversation, sendMessage } from '../api/chat.js'
import toast from 'react-hot-toast'
import { FiSend, FiMessageSquare, FiUser, FiZap, FiUsers } from 'react-icons/fi'

const SOCKET_URL = 'http://localhost:5000'

export function Chat() {
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const withUserId = searchParams.get('with')

    const [conversations, setConversations] = useState([])
    const [activeContact, setActiveContact] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMsg, setNewMsg] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [loadingConvs, setLoadingConvs] = useState(true)
    const [loadingMsgs, setLoadingMsgs] = useState(false)
    const [sending, setSending] = useState(false)

    const socketRef = useRef(null)
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    useEffect(() => {
        if (!user) return
        const socket = io(SOCKET_URL, { transports: ['websocket'] })
        socketRef.current = socket

        socket.on('connect', () => {
            const uId = user?._id || user?.id
            if (uId) socket.emit('join', uId)
        })

        socket.on('receiveMessage', (data) => {
            setMessages((prev) => {
                if (prev.find((m) => m._id === data._id)) return prev
                return [...prev, data]
            })
            fetchConversations(false)
        })

        socket.on('userTyping', (data) => {
            const uId = user?._id || user?.id
            if (uId && String(data.senderId) !== String(uId)) {
                setIsTyping(true)
                clearTimeout(typingTimeoutRef.current)
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [user])

    const fetchConversations = useCallback(async (showLoading = true) => {
        if (showLoading) setLoadingConvs(true)
        try {
            const { data } = await getConversations()
            setConversations(data)
        } catch {
            // silent
        } finally {
            if (showLoading) setLoadingConvs(false)
        }
    }, [])

    useEffect(() => {
        fetchConversations()
    }, [fetchConversations])

    useEffect(() => {
        if (!withUserId || loadingConvs) return
        const existing = conversations.find((c) => c.user._id === withUserId)
        if (existing) {
            setActiveContact(existing.user)
        } else {
            setActiveContact({ _id: withUserId, name: 'User', role: '' })
        }
    }, [withUserId, loadingConvs, conversations])

    useEffect(() => {
        if (!activeContact) return
        setLoadingMsgs(true)
        setMessages([])
        setIsTyping(false)
        getConversation(activeContact._id)
            .then(({ data }) => setMessages(data))
            .catch(() => toast.error('Failed to load messages'))
            .finally(() => setLoadingMsgs(false))
    }, [activeContact])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMsg.trim() || !activeContact || sending) return
        const text = newMsg.trim()
        setNewMsg('')
        setSending(true)
        try {
            const { data } = await sendMessage(activeContact._id, text)
            setMessages((prev) => [...prev, data])
            socketRef.current?.emit('sendMessage', {
                ...data,
                receiverId: activeContact._id
            })
            fetchConversations(false)
        } catch {
            toast.error('Failed to send message')
            setNewMsg(text)
        } finally {
            setSending(false)
        }
    }

    const handleTyping = (e) => {
        setNewMsg(e.target.value)
        if (!activeContact) return
        const uId = user?._id || user?.id
        socketRef.current?.emit('typing', {
            senderId: uId,
            receiverId: activeContact._id
        })
    }

    const formatTime = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        const today = new Date()
        const diff = new Date(today.toDateString()) - new Date(d.toDateString())
        if (diff === 0) return 'Today'
        if (diff === 86400000) return 'Yesterday'
        return new Date(dateStr).toLocaleDateString()
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden animate-fade-in text-zinc-200">
            {/* Sidebar - Contacts */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col bg-zinc-950/50">
                <div className="p-5 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiMessageSquare className="text-rose-500" /> Messages
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="flex items-center justify-center p-10">
                            <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-900/30">
                                <FiUsers className="text-rose-500" />
                            </div>
                            <p className="text-xs text-zinc-500 font-medium tracking-tight">No active conversations</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.user._id}
                                onClick={() => setActiveContact(conv.user)}
                                className={`w-full p-4 flex items-center gap-3 transition-all border-l-4 ${activeContact?._id === conv.user._id
                                    ? 'bg-rose-950/20 border-rose-600'
                                    : 'border-transparent hover:bg-zinc-800/50'
                                    }`}
                            >
                                <div className="w-11 h-11 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-600/20">
                                    {conv.user.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                    <p className="font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                                        {conv.user.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                                        {conv.lastMessage?.message ?? 'No messages yet'}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-rose-500/40">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-950">
                {activeContact ? (
                    <>
                        {/* Chat header */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                    {activeContact.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-none">{activeContact.name}</h3>
                                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                                        {isTyping ? <span className="text-rose-500 animate-pulse">Typing...</span> : '● Online'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-950">
                            {loadingMsgs ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                                    <FiZap className="w-8 h-8 mb-2" />
                                    <p className="text-xs font-medium">Start the conversation</p>
                                </div>
                            ) : (
                                (() => {
                                    let lastDate = null
                                    return messages.map((msg) => {
                                        // Hyper-robust ID extraction
                                        const getRawId = (val) => {
                                            if (!val) return null;
                                            if (typeof val === 'string') return val;
                                            if (typeof val === 'object') return val._id || val.id || (val.toString() !== '[object Object]' ? val.toString() : null);
                                            return String(val);
                                        };

                                        const sId = getRawId(msg.senderId);
                                        const uId = getRawId(user);

                                        const isOwn = sId && uId && String(sId).trim() === String(uId).trim();

                                        const msgDate = formatDate(msg.createdAt)
                                        const showDateDivider = msgDate !== lastDate
                                        lastDate = msgDate

                                        return (
                                            <div key={msg._id}>
                                                {showDateDivider && (
                                                    <div className="flex items-center gap-3 my-6">
                                                        <div className="flex-1 h-px bg-zinc-800" />
                                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{msgDate}</span>
                                                        <div className="flex-1 h-px bg-zinc-800" />
                                                    </div>
                                                )}
                                                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up mb-4`}>
                                                    <div
                                                        className={`max-w-[80%] md:max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm ${isOwn
                                                            ? 'bg-rose-600 text-white rounded-tr-none'
                                                            : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
                                                            }`}
                                                    >
                                                        <p className="leading-relaxed">{msg.message}</p>
                                                        <p className={`text-[10px] mt-1.5 opacity-60 font-medium ${isOwn ? 'text-rose-100' : 'text-zinc-500'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                })()
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMsg}
                                    onChange={handleTyping}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMsg.trim() || sending}
                                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white p-3.5 rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                                >
                                    {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-10 text-center">
                        <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 flex items-center justify-center mb-6 animate-float shadow-2xl shadow-rose-600/5">
                            <FiMessageSquare className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-sm text-zinc-500">
                            Choose a contact from the sidebar to reach out or continue your collaboration.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
