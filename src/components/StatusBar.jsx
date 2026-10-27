import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function StatusBar() {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setTime(`${hours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mobile-status-bar">
      <span className="status-bar-time">{time}</span>
      <div className="status-bar-icons">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="9" y="3" width="3" height="9" rx="1" />
          <rect x="13.5" y="0.5" width="3" height="11.5" rx="1" />
        </svg>
        <Wifi size={15} strokeWidth={2.5} />
        <Battery size={18} strokeWidth={2.2} />
      </div>
    </div>
  );
}
