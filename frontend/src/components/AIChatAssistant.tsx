import React, { useState, useRef, useEffect } from 'react'
import './AIChatAssistant.css'

interface AIChatAssistantProps {
    currentText: string
    onClose: () => void
    onUseText: (text: string) => void
}

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIChatAssistant({ currentText, onClose, onUseText }: AIChatAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Dzień dobry! Jestem asystentem AI. Pomogę Ci uzupełnić opis wypadku. Przeanalizuję Twój tekst i zadam pytania pomocnicze, jeśli czegoś brakuje.' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initial analysis simulation if there is text
    useEffect(() => {
        if (currentText && messages.length === 1) {
            handleInitialAnalysis(currentText)
        }
    }, [])

    const handleInitialAnalysis = async (text: string) => {
        setIsTyping(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const analysis = simulateAPI(text, "analysis")
        setMessages(prev => [...prev, { role: 'assistant', content: analysis }])
        setIsTyping(false)
    }

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const newMsg: Message = { role: 'user', content: inputValue }
        setMessages(prev => [...prev, newMsg])
        setInputValue('')
        setIsTyping(true)

        // Simulate API call
        // TODO: Replace with real API call to /api/chat
        // const response = await fetch('/api/chat', ...)

        await new Promise(resolve => setTimeout(resolve, 1500))
        const responseText = simulateAPI(inputValue, "chat", messages)

        setMessages(prev => [...prev, { role: 'assistant', content: responseText }])
        setIsTyping(false)
    }

    // Placeholder for Logic or API connection
    const simulateAPI = (text: string, type: "analysis" | "chat", context?: Message[]) => {
        const lower = text.toLowerCase()

        if (type === "analysis") {
            if (text.length < 20) return "Twój opis jest bardzo krótki. Proszę opisz dokładniej co robiłeś tuż przed wypadkiem?"
            if (!lower.includes("kiedy") && !text.match(/\d{4}/)) return "Widzę opis, ale brakuje mi daty lub godziny. Kiedy dokładnie to się stało?"
            return "Przeczytałem Twój opis. Czy są jeszcze jakieś szczegóły dotyczące otoczenia (np. śliska podłoga, hałas), które warto dodać?"
        }

        // Chat logic
        if (lower.includes("data") || lower.includes("godzina") || text.match(/\d{4}/)) {
            return "Dziękuję. To ważna informacja. A w jakim dokładnie miejscu (pokój, hala) to się wydarzyło?"
        }
        if (lower.includes("miejsce") || lower.includes("hala") || lower.includes("biur")) {
            return "Rozumiem. Czy w tym miejscu panowały jakieś trudne warunki (np. słabe oświetlenie)?"
        }
        if (lower.includes("tak") || lower.includes("nie")) {
            return "Dobrze. Proszę opisz teraz sam moment urazu - co dokładnie poczułeś i która część ciała ucierpiała?"
        }

        return "Rozumiem. Co stało się potem? Czy ktoś udzielił Ci pomocy?"
    }

    return (
        <div className="ai-chat-overlay">
            <div className="ai-chat-window">
                <div className="ai-chat-header">
                    <div className="ai-chat-title">
                        <span>🤖</span> Asystent Opisu
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
