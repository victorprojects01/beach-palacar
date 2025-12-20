import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';
import { interpretCommand } from '../services/geminiService';
import { ChatMessage, GeminiAction } from '../types';

interface AssistantChatProps {
  onAction: (action: GeminiAction) => void;
  p1Name: string;
  p2Name: string;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({ onAction, p1Name, p2Name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Olá! Sou seu assistente de quadra. Diga "Ponto" ou o nome do jogador para eu atualizar o placar!' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const result = await interpretCommand(userText, p1Name, p2Name);
    
    setIsLoading(false);
    
    if (result.message) {
      setMessages(prev => [...prev, { role: 'assistant', text: result.message }]);
    }

    onAction(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-beach-orange text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 transition-all z-50 animate-bounce"
        aria-label="Abrir assistente"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-50 flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-beach-yellow to-beach-orange p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold">Assistente Beach</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-orange-100">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-beach-sand/30 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-beach-orange text-white rounded-tr-none' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-beach-orange rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-beach-yellow rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-beach-orange rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ex: Ponto do ${p1Name}...`}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-beach-orange"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-beach-orange text-white p-2 rounded-xl hover:bg-orange-600 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};