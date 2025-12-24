import React from 'react';

type NotificationButtonProps = {
  title: string;
  body: string;
  icon?: string;
  buttonText?: string;
};

const NotificationButton: React.FC<NotificationButtonProps> = ({
  title,
  body,
  icon = '/logo192.png',
  buttonText = 'Enable Notifications',
}) => {
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      // Send message to Service Worker to trigger notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage('trigger-notification');
      } else {
        // Wait for service worker to become active
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage('trigger-notification');
        });
      }
    } else {
      alert('Notification permission denied.');
    }
  };

  return <button onClick={requestNotificationPermission}>{buttonText}</button>;
};

export default NotificationButton;