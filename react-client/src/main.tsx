import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/main.css'
import { SocketProvider } from './SocketContext'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)