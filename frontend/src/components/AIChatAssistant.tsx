import { useState, useRef, useEffect } from 'react'
import './AIChatAssistant.css'

interface AIChatAssistantProps {
    onClose: () => void
    onUseText: (text: string) => void
    onUpdateFormData?: (data: any) => void
    userData?: {
        imie: string
        nazwisko: string
        nip: string
    }
}

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIChatAssistant({ onClose, onUseText, onUpdateFormData, userData }: AIChatAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Auto-start Groq Session on mount
    useEffect(() => {
        startGroqSession()
    }, [])

    const startGroqSession = async (): Promise<string | null> => {
        setIsTyping(true)
        try {
            const response = await fetch('/api/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imie: userData?.imie || "Nieznane",
                    nazwisko: userData?.nazwisko || "Nieznane",
                    nip: userData?.nip || "0000000000"
                })
            })
            const data = await response.json()
            setSessionId(data.session_id)
            setMessages(prev => {
                // Don't clear history if it's a reconnection, but maybe show a subtle message?
                // For simplified UX, we just append the welcome message if it's the first time
                if (prev.length === 0) {
                    return [{ role: 'assistant', content: data.welcome_message }]
                }
                return prev
            })
            setIsTyping(false)
            return data.session_id
        } catch (error) {
            console.error("Failed to start session:", error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Przepraszam, wystąpił błąd połączenia z serwerem." }])
            setIsTyping(false)
            return null
        }
    }

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const currentInput = inputValue
        const newMsg: Message = { role: 'user', content: currentInput }
        setMessages(prev => [...prev, newMsg])
        setInputValue('')
        setIsTyping(true)

        const sendMessage = async (sid: string | null, text: string) => {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sid,
                    user_message: text
                })
            })
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("SESSION_EXPIRED")
                }
                throw new Error("API_ERROR")
            }
            return await response.json()
        }

        try {
            let data = null
            try {
                data = await sendMessage(sessionId, currentInput)
            } catch (err: any) {
                if (err.message === "SESSION_EXPIRED") {
                    console.warn("Session expired, reconnecting...")
                    const newSessionId = await startGroqSession()
                    if (newSessionId) {
                        data = await sendMessage(newSessionId, currentInput)
                    } else {
                        throw new Error("Could not reconnect")
                    }
                } else {
                    throw err
                }
            }

            if (data) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.ai_message }])

                if (data.is_finished && data.checklist) {
                    if (onUpdateFormData) {
                        onUpdateFormData(data.checklist)
                        setMessages(prev => [...prev, { role: 'assistant', content: "✅ Zebrałem wszystkie informacje i zaktualizowałem formularz." }])
                    }
                }
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Wystąpił błąd podczas rozmowy. Spróbuj odświeżyć okno." }])
        }
        setIsTyping(false)
    }

    return (
        <div className="ai-chat-overlay">
            <div className="ai-chat-window">
                <div className="ai-chat-header">
                    <div className="ai-chat-title">
                        <span>🤖</span> Inteligentny Asystent
                    </div>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="ai-chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message assistant typing">
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="ai-chat-input-area">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Napisz wiadomość..."
                        autoFocus
                    />
                    <button className="btn-send" onClick={handleSend}>Wyślij</button>
                </div>

                <div className="ai-chat-footer">
                    <button className="btn-use-text" onClick={() => onUseText(messages.map(m => m.role === 'user' ? m.content : '').filter(Boolean).join(' '))}>
                        Użyj naszych ustaleń w opisie
                    </button>
                </div>
            </div>
        </div>
    )
}
