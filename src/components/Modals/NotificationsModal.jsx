import React from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, notifications, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title-wrap">
            <span className="modal-title">Notifications</span>
            <span className="modal-subtitle">Stay tuned with campus events</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close notifications">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {notifications && notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((item) => (
                <div key={item.id} className="notification-card-item">
                  <div className="notification-icon-bubble">
                    <Bell size={16} color="#2563EB" />
                  </div>
                  <div className="notification-card-content">
                    <div className="notification-card-head">
                      <span className="notification-item-title">{item.title}</span>
                      <span className="notification-item-time">{item.time}</span>
                    </div>
                    <p className="notification-item-msg">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-notice">
              <CheckCheck size={32} color="#9CA3AF" />
              <p>You're all caught up!</p>
            </div>
          )}
        </div>

        {notifications && notifications.length > 0 && (
          <div className="modal-footer-action">
            <button className="secondary-clear-btn" onClick={onClearAll}>
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
