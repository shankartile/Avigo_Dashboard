import React, { useEffect } from 'react';

const WebSocketNotificationListener: React.FC = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001'); // Replace with your WebSocket server URL
    // const socket = new WebSocket('ws://localhost:5173'); 

    socket.onopen = () => {
      console.log('[WebSocket] Connected');
    };

    socket.onmessage = (event) => {
      console.log('[WebSocket] Message received:', event.data);

      const { title, body, url } = JSON.parse(event.data);

      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({
            type: 'show-notification',
            title,
            body,
            url,
          });
        });
      }
    };

    socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    socket.onclose = () => {
      console.warn('[WebSocket] Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  return null; // This is just a background listener component
};

export default WebSocketNotificationListener;
