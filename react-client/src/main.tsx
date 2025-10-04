import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SocketProvider, useSocketContext } from './SocketContext.tsx'
import TopNavbar from './TopNavbar.tsx'
import JoinScreen from './JoinScreen.tsx'
import Lobby from './Lobby.tsx'

function App() {
  const { currentScreen } = useSocketContext();

  return (
    <>
      <TopNavbar />
      <div className="main-content">
        {currentScreen === 'join' ? <JoinScreen /> : <Lobby />}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)
