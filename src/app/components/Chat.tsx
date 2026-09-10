'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: userMessage.content })
      });
      
      const data = await res.json();
      if (res.ok) {
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          agent: data.agent,
          usage: data.usage
        }]);
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <p className="text-lg font-medium text-gray-500 mb-1">How can I help you today?</p>
            <p className="text-sm">Ask general questions or inquire about company policies.</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-4 max-w-[85%] sm:max-w-[75%]">
                <span className="flex gap-1.5 items-center h-2">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
             </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <span className="bg-red-50 text-red-600 px-3 py-1.5 text-sm rounded-md border border-red-100">
              {error}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 sm:px-6 bg-transparent">
        <form onSubmit={sendMessage} className="relative flex items-center max-w-3xl mx-auto shadow-sm rounded-full bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message Assistant..."
            className="w-full bg-transparent text-gray-900 rounded-full py-3.5 px-5 pr-14 focus:outline-none disabled:opacity-50 text-base"
            disabled={loading}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-3 mb-1">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
