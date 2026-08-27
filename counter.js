// counter.js — animate detection counter with more features
(function() {
  var el = document.getElementById('detections');
  if (!el) return;
  var count = 23;
  var history = [];
  
  setInterval(function() {
    if (Math.random() < 0.15) {
      count++;
      el.textContent = count;
      el.style.color = '#E8A020';
      setTimeout(function() { el.style.color = ''; }, 600);
      
      // Track history
      history.push({ count: count, timestamp: new Date() });
      if (history.length > 50) history.shift();
      
      // Update localStorage
      localStorage.setItem('detectionHistory', JSON.stringify(history));
    }
  }, 4000);

  // Add reset function
  window.resetDetections = function() {
    count = 23;
    el.textContent = count;
    history = [];
    localStorage.removeItem('detectionHistory');
  };

  // Add export function
  window.exportDetections = function() {
    return JSON.stringify(history);
  };

  // Load from localStorage if available
  var saved = localStorage.getItem('detectionHistory');
  if (saved) {
    try {
      history = JSON.parse(saved);
      if (history.length > 0) {
        count = history[history.length - 1].count;
        el.textContent = count;
      }
    } catch(e) {
      console.log('Error loading history');
    }
  }
})();