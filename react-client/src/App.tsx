import TopNavbar from './TopNavbar'
import JoinScreen from './JoinScreen'
import Lobby from './Lobby'
import InputScreen from './InputScreen'
import { useSocketContext } from './SocketContext'

export default function App() {
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
