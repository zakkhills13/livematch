// Mock view counter update function
function updateViewCounter() {
    const viewElement = document.getElementById('views');
    let currentViews = parseInt(viewElement.textContent, 10);
    // Simulate view count increment
    currentViews += Math.floor(Math.random() * 10); // Random increment for demo purposes
    viewElement.textContent = currentViews.toString();
}

// Update the view counter every 5 seconds
setInterval(updateViewCounter, 5000);
