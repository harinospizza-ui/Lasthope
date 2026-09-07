// Background worker for Harino's Pizza - keeps timers active even when tab is backgrounded
let intervalId = null;

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'START') {
    const intervalMs = e.data.interval || 10000;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      self.postMessage({ type: 'TICK', timestamp: Date.now() });
    }, intervalMs);
    self.postMessage({ type: 'STARTED' });
  } else if (e.data && e.data.type === 'STOP') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    self.postMessage({ type: 'STOPPED' });
  }
});
