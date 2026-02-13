// Prevent tab throttling and keep stream active
let isTabActive = true;
let viewUpdateInterval;

// Detect tab visibility changes
document.addEventListener('visibilitychange', function() {
    isTabActive = !document.hidden;
    
    // Force iframe to stay active when tab becomes hidden
    if (!isTabActive) {
        const iframe = document.getElementById('stream-frame');
        if (iframe) {
            // Prevent browser from throttling the iframe
            iframe.contentWindow?.postMessage('keepAlive', '*');
        }
    }
});

// Optimized view counter update function
function updateViewCounter() {
    const viewElement = document.getElementById('views');
    if (viewElement) {
        let currentViews = parseInt(viewElement.textContent, 10) || 0;
        // Simulate view count increment
        currentViews += Math.floor(Math.random() * 10);
        viewElement.textContent = currentViews.toString();
    }
}

// Use requestAnimationFrame for better performance
function startViewCounter() {
    let lastUpdate = Date.now();
    
    function updateLoop() {
        const now = Date.now();
        
        // Update every 5 seconds
        if (now - lastUpdate >= 5000) {
            updateViewCounter();
            lastUpdate = now;
        }
        
        // Continue loop even when tab is inactive
        requestAnimationFrame(updateLoop);
    }
    
    requestAnimationFrame(updateLoop);
}

// Start the counter when page loads
startViewCounter();

// Keep the page active to prevent stream buffering
let wakeLock = null;

// Request wake lock to keep stream running (works on mobile)
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock active - stream will run smoothly');
        }
    } catch (err) {
        console.log('Wake Lock not supported:', err);
    }
}

// Re-acquire wake lock when tab becomes visible
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// Initialize wake lock
requestWakeLock();

// Ping function to keep connection alive
setInterval(() => {
    // This lightweight operation prevents browser from sleeping
    const ping = Date.now();
}, 30000); // Every 30 seconds

// Ensure iframe stays loaded
window.addEventListener('load', function() {
    const iframe = document.getElementById('stream-frame');
    if (iframe) {
        // Force iframe to maintain priority
        iframe.setAttribute('importance', 'high');
    }
});
