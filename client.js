(function() {
    if (window.magenpayNotifierInitialized) return;
    window.magenpayNotifierInitialized = true;

    const scriptTag = document.currentScript;
    if (!scriptTag) {
        console.error("Magenpay Notifier: Unable to find script tag.");
        return;
    }

    const config = {
        userId: scriptTag.getAttribute('data-user-id'),
        merchantId: scriptTag.getAttribute('data-merchant-uuid'),
        position: scriptTag.getAttribute('data-position') || 'top-right',
        socketUrl: 'wss://socket.magenpay.com'
    };

    if (!config.userId || !config.merchantId) {
        console.error("Magenpay Notifier: Please specify 'data-user-id' and 'data-merchant-uuid' in script tag");
        return;
    }

    class MagenpayNotifier {
        constructor(config) {
            this.config = config;
            this.container = null;
            this.injectStyles();
            this.createContainer();
            this.connect();
        }

        injectStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                .magenpay-notifier-container {
                    position: fixed; z-index: 9999; width: 320px;
                    max-width: 90%; display: flex; flex-direction: column; gap: 10px;
                }
                .magenpay-notifier-container.top-right { top: 20px; right: 20px; }
                .magenpay-notifier-container.top-left { top: 20px; left: 20px; }
                .magenpay-notifier-container.bottom-right { bottom: 20px; right: 20px; }
                .magenpay-notifier-container.bottom-left { bottom: 20px; left: 20px; }
                .magenpay-notification {
                    background-color: #ffffff; color: #333; border-radius: 8px;
                    padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    animation: magenpay-fade-in 0.5s ease; opacity: 1;
                    transition: opacity 0.5s ease, transform 0.5s ease;
                    transform: translateX(0);
                }
                .magenpay-notification.closing { opacity: 0; transform: translateX(100%); }
                .magenpay-notification-title { font-weight: bold; margin-bottom: 8px; font-size: 16px; }
                .magenpay-notification-body { font-size: 14px; line-height: 1.4; }
                @keyframes magenpay-fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }`;
            document.head.appendChild(style);
        }

        createContainer() {
            this.container = document.createElement('div');
            this.container.className = `magenpay-notifier-container ${this.config.position}`;
            document.body.appendChild(this.container);
        }

        connect() {
            console.log(`Magenpay Notifier: Connecting for user ${this.config.userId} of merchant ${this.config.merchantId}`);
            const socket = new WebSocket(this.config.socketUrl);

            socket.onopen = () => {
                console.log('Magenpay Notifier: Connection established.');
                socket.send(JSON.stringify({
                    type: 'register',
                    userId: this.config.userId,
                    merchantId: this.config.merchantId
                }));
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (window.MagenpayNotifierCallbacks && typeof window.MagenpayNotifierCallbacks.onMessage === 'function') {
                        
                        const continueDefaultBehavior = window.MagenpayNotifierCallbacks.onMessage(data);
                        if (continueDefaultBehavior === false) {
                            return;
                        }
                    }

                    this.displayNotification(data);

                } catch (e) {
                    console.error("Magenpay Notifier: Error parsing message from server", e);
                }
            };

            socket.onclose = () => {
                console.log('Magenpay Notifier: Connection closed. Reconnecting in 5 seconds...');
                setTimeout(() => this.connect(), 5000);
            };

            socket.onerror = (error) => {
                console.error('Magenpay Notifier: WebSocket error', error);
                socket.close();
            };
        }

        displayNotification(data) {
            if (!data.title || !data.body) return;

            const notificationElement = document.createElement('div');
            notificationElement.className = 'magenpay-notification';

            const titleElement = document.createElement('div');
            titleElement.className = 'magenpay-notification-title';
            titleElement.textContent = data.title;

            const bodyElement = document.createElement('div');
            bodyElement.className = 'magenpay-notification-body';
            bodyElement.textContent = data.body;

            notificationElement.appendChild(titleElement);
            notificationElement.appendChild(bodyElement);

            this.container.appendChild(notificationElement);

            setTimeout(() => {
                notificationElement.classList.add('closing');
                setTimeout(() => {
                    notificationElement.remove();
                }, 500);
            }, 5000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new MagenpayNotifier(config));
    } else {
        new MagenpayNotifier(config);
    }

})();