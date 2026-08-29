import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  RefreshCw,
  Minus,
  ChevronDown,
  Bot
} from 'lucide-react';
import { sendChatbotMessage, ChatMessageItem } from '../services/api';

const LOGO_SRC = '/assets/logo-main.png';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hello! Welcome to **Bugs n Bricks**.\n\nHow can I help you today? You can ask about our published job vacancies, recruitment services, or AI resume evaluation.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userMsgText = text.trim();
    if (!textToSend) {
      setInputMessage('');
    }
    setLastFailedMessage(null);

    const newUserMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages
        .filter(m => m.id !== 'welcome-1' && !m.error)
        .slice(-10)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await sendChatbotMessage(userMsgText, historyPayload);

      const assistantMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply || "I am here to help you with Bugs n Bricks recruitment services and job openings.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chatbot API error:', err);
      setLastFailedMessage(userMsgText);
      const errorMsg: ChatMessageItem = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Unable to send message. (${err.message || 'Connection error'}). Please click Retry below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      setMessages(prev => prev.filter(m => !m.error));
      handleSendMessage(lastFailedMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={i} className="font-bold text-[#052842]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return <code key={i} className="bg-sky-50 text-[#052842] px-1 py-0.5 rounded font-mono text-[11px] border border-sky-200">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed font-sans text-black">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return <h4 key={idx} className="font-bold text-[#052842] text-sm sm:text-base mt-2 mb-1">{parseInlineFormatting(headingText)}</h4>;
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-2 border-slate-200" />;
          }
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const listItem = trimmed.replace(/^[\*\-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-[#0284c7] font-bold mt-0.5">•</span>
                <span className="flex-1 text-black">{parseInlineFormatting(listItem)}</span>
              </div>
            );
          }
          return <p key={idx} className="my-1 text-black">{parseInlineFormatting(trimmed)}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#052842] pl-3 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-200 cursor-pointer"
          aria-label="Open Chat"
        >
          <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
            <Bot size={18} />
          </div>
          <img src={LOGO_SRC} alt="Bugs n Bricks" className="h-6 w-auto object-contain" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[92vw] sm:w-[380px] md:w-[400px] bg-[#052842] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header - White Section */}
          <div className="bg-white text-[#052842] px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <img src={LOGO_SRC} alt="Bugs n Bricks" className="h-7 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-600 hover:text-[#052842] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <ChevronDown size={18} className="rotate-180" /> : <Minus size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-600 hover:text-[#052842] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body - Dark Blue Section */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[400px] min-h-[280px] bg-[#052842] space-y-3.5">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {isUser ? (
                        <div className="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold text-xs">
                          U
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Bot size={16} />
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${
                            isUser
                              ? 'bg-[#0284c7] text-white rounded-tr-none shadow-xs'
                              : msg.error
                              ? 'bg-rose-100 border border-rose-300 text-rose-950 rounded-tl-none'
                              : 'bg-white border border-slate-200 text-black rounded-tl-none shadow-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="text-xs sm:text-sm leading-relaxed text-white">{msg.content}</p>
                          ) : (
                            renderFormattedMessage(msg.content)
                          )}

                          {/* Retry Option if Failed */}
                          {msg.error && lastFailedMessage && (
                            <div className="mt-2 pt-2 border-t border-rose-200">
                              <button
                                onClick={handleRetry}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer shadow-xs"
                              >
                                <RefreshCw size={12} />
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-sky-200/70 mt-1 px-1 font-sans">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing / Loading Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0 shadow-xs">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Dark Blue Container with White Placeholder & Black Text */}
              <div className="p-3 bg-[#011c30] border-t border-sky-900/50">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 bg-sky-100 text-black placeholder:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-sky-300 focus:border-white focus:bg-white focus:outline-none transition-all disabled:opacity-60"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#0284c7] hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 text-white p-2.5 rounded-xl transition-all disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0"
                    title="Send Message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


