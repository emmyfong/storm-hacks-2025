import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/main.css'
import { SocketProvider } from './SocketContext'
import App from './App'
import EndScreen from './EndScreen'
import Chat from "./Chat";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <Chat />
    </SocketProvider>
  </StrictMode>,
)