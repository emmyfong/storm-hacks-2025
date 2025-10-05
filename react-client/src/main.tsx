import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/main.css'
import { SocketProvider, useSocketContext } from './SocketContext.tsx'
import TopNavbar from './TopNavbar.tsx'
import JoinScreen from './JoinScreen.tsx'
import Lobby from './Lobby.tsx'
import InputScreen from './InputScreen.tsx'

function App() {
  const { currentScreen } = useSocketContext();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'join':
        return <JoinScreen />;
      case 'lobby':
        return <Lobby />;
      case 'input':
        return <InputScreen />;
      default:
        return <JoinScreen />;
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="main-content">
        {renderCurrentScreen()}
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
