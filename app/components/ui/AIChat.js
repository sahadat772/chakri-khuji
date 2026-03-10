'use client';

import { useState, useRef, useEffect } from 'react';

const quickQuestions = [
    'How to write a good CV?',
    'Interview tips for freshers',
    'How to negotiate salary?',
    'Best skills to learn in 2025',
];

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I am Chakri AI 👋 I can help you with career advice, resume tips, interview prep, and job search strategies. How can I help you today?',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(function () {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    useEffect(function () {
        if (!isOpen) return;
        const t1 = setTimeout(function () { setHasNew(false); }, 0);
        const t2 = setTimeout(function () {
            if (inputRef.current) inputRef.current.focus();
        }, 300);
        return function () { clearTimeout(t1); clearTimeout(t2); };
    }, [isOpen]);

    async function sendMessage(text) {
        const userMessage = text || input.trim();
        if (!userMessage || loading) return;

        setInput('');
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.map(function (m) {
                        return { role: m.role, content: m.content };
                    }),
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(function (prev) {
                    return [...prev, { role: 'assistant', content: data.reply }];
                });
                if (!isOpen) setHasNew(true);
            } else {
                setMessages(function (prev) {
                    return [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }];
                });
            }
        } catch (err) {
            setMessages(function (prev) {
                return [...prev, { role: 'assistant', content: 'Connection error. Please check your internet.' }];
            });
        }
        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function clearChat() {
        setMessages([{
            role: 'assistant',
            content: 'Hi! I am Chakri AI 👋 How can I help you today?',
        }]);
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={function () { setIsOpen(!isOpen); }}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 8px 32px #8b5cf640',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={function (e) { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.transform = 'scale(1)'; }}>
                {isOpen ? '✕' : '🤖'}
                {hasNew && !isOpen && (
                    <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#f87171',
                        border: '2px solid var(--bg)',
                    }} />
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '6rem',
                    right: '2rem',
                    width: '360px',
                    maxHeight: '520px',
                    borderRadius: '20px',
                    background: '#13131f',
                    border: '1px solid #2e2e4e',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                    zIndex: 998,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.3s ease',
                }}>

                    {/* Header */}
                    <div style={{
                        padding: '1rem 1.25rem',
                        background: 'linear-gradient(135deg, #8b5cf610, #22d3ee10)',
                        borderBottom: '1px solid #2e2e4e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                            }}>🤖</div>
                            <div>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', fontSize: '14px' }}>Chakri AI</div>
                                <div style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                                    Online
                                </div>
                            </div>
                        </div>
                        <button onClick={clearChat}
                            style={{ background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}
                            onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; }}
                            onMouseLeave={function (e) { e.currentTarget.style.color = '#6060a0'; }}>
                            Clear
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        scrollbarWidth: 'thin',
                    }}>
                        {messages.map(function (msg, i) {
                            const isUser = msg.role === 'user';
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    animation: 'fadeInUp 0.3s ease',
                                }}>
                                    <div style={{
                                        maxWidth: '85%',
                                        padding: '10px 14px',
                                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        background: isUser
                                            ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                            : '#1e1e3a',
                                        color: isUser ? 'white' : '#d0d0f0',
                                        fontSize: '13px',
                                        lineHeight: 1.6,
                                        border: isUser ? 'none' : '1px solid #2e2e4e',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}

                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '16px 16px 16px 4px',
                                    background: '#1e1e3a',
                                    border: '1px solid #2e2e4e',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                }}>
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 2 && (
                        <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {quickQuestions.map(function (q) {
                                return (
                                    <button key={q} onClick={function () { sendMessage(q); }}
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            background: '#8b5cf615',
                                            border: '1px solid #8b5cf630',
                                            color: '#a78bfa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={function (e) { e.currentTarget.style.background = '#8b5cf625'; }}
                                        onMouseLeave={function (e) { e.currentTarget.style.background = '#8b5cf615'; }}>
                                        {q}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderTop: '1px solid #2e2e4e',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-end',
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={function (e) { setInput(e.target.value); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about your career..."
                            rows={1}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '12px',
                                background: '#1a1a2e',
                                border: '1px solid #2e2e4e',
                                color: '#e8e8f0',
                                fontSize: '13px',
                                outline: 'none',
                                resize: 'none',
                                maxHeight: '100px',
                                lineHeight: 1.5,
                            }}
                        />
                        <button
                            onClick={function () { sendMessage(); }}
                            disabled={!input.trim() || loading}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: input.trim() && !loading ? 'linear-gradient(135deg, #8b5cf6, #22d3ee)' : '#2e2e4e',
                                border: 'none',
                                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                            }}>
                            {loading ? '⏳' : '➤'}
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}