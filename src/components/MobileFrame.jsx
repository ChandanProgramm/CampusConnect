import React from 'react';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';

export default function MobileFrame({
  children,
  currentScreen,
  activeTab,
  onSelectTab,
  unreadChatCount
}) {
  // Show bottom navigation only on main tabs
  const isMainTab = ['home', 'people', 'projects', 'chats', 'profile'].includes(currentScreen);

  return (
    <div className="desktop-viewport-canvas">
      <div className="mobile-app-device-frame">
        {/* Viewport Screen Content */}
        <div className="mobile-app-screen">
          <StatusBar />

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            {children}
          </main>

          {isMainTab && (
            <BottomNav
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              unreadChatCount={unreadChatCount}
            />
          )}

          <div className="mobile-home-indicator-container">
            <div className="mobile-home-indicator-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
