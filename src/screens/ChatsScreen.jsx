import React, { useState } from 'react';
import { Search, SquarePen } from 'lucide-react';

export default function ChatsScreen({
  conversations,
  onSelectConversation,
  onShowToast
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = c.name.toLowerCase().includes(q);
    const lastMsg = c.messages?.[c.messages.length - 1]?.text || '';
    return nameMatch || lastMsg.toLowerCase().includes(q);
  });

  return (
    <div className="chats-screen-wrap">
      {/* Header */}
      <div className="app-header">
        <div style={{ width: 36 }} />
        <span className="app-header-title">Chats</span>
        <button
          className="header-action-btn"
          onClick={() => onShowToast('New chat options coming soon!', 'alert')}
          aria-label="New Message"
        >
          <SquarePen size={20} color="#111827" />
        </button>
      </div>

      <div className="screen-scroll-container">
        {/* Search Bar matching Blueprint 5 */}
        <div className="app-search-wrapper">
          <div className="app-search-box">
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              className="app-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="conversations-list-container">
          {filteredConversations.map((convo) => {
            const lastMessage = convo.messages?.[convo.messages.length - 1]?.text || 'No messages yet';
            return (
              <div
                key={convo.id}
                id={`convo-item-${convo.id}`}
                className="chat-list-row-item"
                onClick={() => onSelectConversation(convo.id)}
              >
                {/* Avatar Initials Circle */}
                <div
                  className="user-avatar-circle"
                  style={{ backgroundColor: convo.avatarBg, color: convo.avatarColor }}
                >
                  <span>{convo.initials}</span>
                </div>

                {/* Details */}
                <div className="chat-row-details">
                  <div className="chat-row-top-line">
                    <span className="chat-convo-name">{convo.name}</span>
                    <span className="chat-convo-time">{convo.time}</span>
                  </div>

                  <div className="chat-row-bottom-line">
                    <p className="chat-last-message-preview">{lastMessage}</p>
                    {convo.unread > 0 && (
                      <span className="chat-unread-badge-pill">{convo.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
