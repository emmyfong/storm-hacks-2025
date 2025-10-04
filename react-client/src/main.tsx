import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocketContext from './SocketContext.tsx'
import TopNavbar from './TopNavbar.tsx'
//import Lobby from './Lobby.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TopNavbar />
    <SocketContext />
  </StrictMode>,
)
