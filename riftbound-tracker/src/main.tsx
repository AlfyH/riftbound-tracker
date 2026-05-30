import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Lock to portrait when the API is available (installed PWA / Android Chrome)
if (screen.orientation && typeof (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock === 'function') {
  (screen.orientation as ScreenOrientation & { lock: (o: string) => Promise<void> })
    .lock('portrait')
    .catch(() => { /* silently ignore – desktop browsers reject this */ });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
