import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send } from 'lucide-react';

export default function ChatRoomScreen({
  conversation,
  onNavigateBack,
  onSendMessage
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="chat-room-wrap">
      {/* Header */}
      <div className="app-header chat-room-header">
        <button
          className="header-action-btn"
          onClick={onNavigateBack}
          aria-label="Back to chats"
        >
          <ChevronLeft size={24} color="#111827" />
        </button>

        <div className="chat-room-header-info">
          <div
            className="user-avatar-circle small-avatar"
            style={{ backgroundColor: conversation.avatarBg, color: conversation.avatarColor }}
          >
            <span>{conversation.initials}</span>
          </div>
          <div className="chat-room-names">
            <span className="chat-room-title">{conversation.name}</span>
            <span className="chat-room-status">
              {conversation.isProject ? 'Team Channel • Active' : 'Online'}
            </span>
          </div>
        </div>

        <div style={{ width: 24 }} />
      </div>

      {/* Messages Stream */}
      <div className="screen-scroll-container chat-messages-stream">
        <div className="chat-day-divider">
          <span>Today</span>
        </div>

        {conversation.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.isMe ? 'my-message-row' : 'their-message-row'}`}
          >
            <div className={`chat-bubble ${msg.isMe ? 'my-bubble' : 'their-bubble'}`}>
              {!msg.isMe && conversation.isProject && msg.sender && (
                <span className="bubble-sender-name">{msg.sender}</span>
              )}
              <p className="bubble-text-content">{msg.text}</p>
              <span className="bubble-timestamp">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          id="chat-message-input"
          className="chat-text-input-field"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          id="btn-send-message"
          className="chat-send-btn"
          disabled={!inputText.trim()}
          aria-label="Send Message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
