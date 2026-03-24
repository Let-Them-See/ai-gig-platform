'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

const conversations = [
  { id: '1', name: 'Sarah Anderson', lastMessage: 'Great, I will start working on the RAG pipeline today!', time: '2m ago', unread: 2, initials: 'SA', gradient: 'from-brand-400 to-accent-500' },
  { id: '2', name: 'Alex Turner', lastMessage: 'The milestone is approved. Payment has been released.', time: '1h ago', unread: 0, initials: 'AT', gradient: 'from-success to-teal-500' },
  { id: '3', name: 'Raj Krishnan', lastMessage: 'Can you share the dataset access credentials?', time: '3h ago', unread: 1, initials: 'RK', gradient: 'from-purple-500 to-pink-500' },
];

const messages = [
  { id: '1', sender: 'them', content: 'Hi! I saw your gig posting for the RAG pipeline. I have extensive experience with LangChain and Pinecone.', time: '10:30 AM' },
  { id: '2', sender: 'me', content: 'Great! Can you share some examples of similar projects you have worked on?', time: '10:35 AM' },
  { id: '3', sender: 'them', content: 'Sure! I recently built a RAG system for a healthcare company that processes 50K+ documents. Let me share the details.', time: '10:40 AM' },
  { id: '4', sender: 'them', content: 'Great, I will start working on the RAG pipeline today!', time: '10:45 AM' },
];

export default function MessagesPage() {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Messages</h1>
      <div className="card-elevated flex h-[calc(100%-3rem)] overflow-hidden">
        {/* Conversation list */}
        <div className="w-80 border-r border-surface-200 flex flex-col">
          <div className="p-4 border-b border-surface-200">
            <input
              type="text" placeholder="Search conversations..."
              className="w-full px-3 py-2 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveConvo(c)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-surface-50 transition-colors ${activeConvo.id === c.id ? 'bg-brand-50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-surface-900">{c.name}</p>
                    <span className="text-xs text-surface-800/50">{c.time}</span>
                  </div>
                  <p className="text-xs text-surface-800/60 truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-brand-500 text-white rounded-full text-xs flex items-center justify-center">{c.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-surface-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeConvo.gradient} flex items-center justify-center text-white text-sm font-bold`}>
              {activeConvo.initials}
            </div>
            <p className="font-semibold text-surface-900">{activeConvo.name}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  m.sender === 'me'
                    ? 'bg-brand-500 text-white rounded-br-md'
                    : 'bg-surface-100 text-surface-900 rounded-bl-md'
                }`}>
                  <p>{m.content}</p>
                  <p className={`text-xs mt-1 ${m.sender === 'me' ? 'text-brand-100' : 'text-surface-800/40'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-surface-200 flex gap-3">
            <input
              type="text" placeholder="Type a message..." value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 outline-none focus:border-brand-500 text-sm"
            />
            <button className="btn-primary px-4 py-2.5">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
