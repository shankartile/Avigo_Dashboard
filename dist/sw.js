
self.addEventListener('install', () => {
    console.log('[Service Worker] Installed');
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    console.log('[Service Worker] Activated');
    self.clients.claim();
});


// Listen for test message from page
self.addEventListener('message', (event) => {
    if (event.data === 'trigger-notification')
    {
        const title = 'Test Notification';
        const options = {
            body: 'This is a manually triggered notification111.',
            icon: '../public/images/logo/main_logo.png',
            data: {
                url: `/admin/ordermanagement`
            }

        };
        
        self.registration.showNotification(title, options);
    }
});


//  Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received');
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';
    console.log(`[Service Worker] Target URL: ${targetUrl}`);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});