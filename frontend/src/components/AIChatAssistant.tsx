import React, { useState, useRef, useEffect } from 'react'
import './AIChatAssistant.css'

interface AIChatAssistantProps {
    currentText: string
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

export default function AIChatAssistant({ currentText, onClose, onUseText, onUpdateFormData, userData }: AIChatAssistantProps) {
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

    const startGroqSession = async () => {
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
            setMessages([
                { role: 'assistant', content: data.welcome_message }
            ])
        } catch (error) {
            console.error("Failed to start session:", error)
            setMessages([{ role: 'assistant', content: "Przepraszam, wystąpił błąd połączenia z serwerem." }])
        }
        setIsTyping(false)
    }

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const newMsg: Message = { role: 'user', content: inputValue }
        setMessages(prev => [...prev, newMsg])
        setInputValue('')
        setIsTyping(true)

        // Groq Mode Only
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_message: inputValue
                })
            })
            const data = await response.json()

            setMessages(prev => [...prev, { role: 'assistant', content: data.ai_message }])

            if (data.is_finished && data.checklist) {
                if (onUpdateFormData) {
                    onUpdateFormData(data.checklist)
                    setMessages(prev => [...prev, { role: 'assistant', content: "✅ Zebrałem wszystkie informacje i zaktualizowałem formularz." }])
                }
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Wystąpił błąd podczas rozmowy." }])
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
