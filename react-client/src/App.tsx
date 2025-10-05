// import TopNavbar from './TopNavbar'
// import JoinScreen from './JoinScreen'
// import Lobby from './Lobby'
// import InputScreen from './InputScreen'

// import { useSocketContext } from './SocketContext'

// export default function App() {
//   const { currentScreen } = useSocketContext();

//   const renderCurrentScreen = () => {
//     switch (currentScreen) {
//       case 'join':
//         return <JoinScreen />;
//       case 'lobby':
//         return <Lobby />;
//       case 'input':
//         return <InputScreen />;
//       default:
//         return <JoinScreen />;
//     }
//   };

//   return (
//     <>
//       <TopNavbar />
//       <div className="main-content">
//         {renderCurrentScreen()}
//       </div>
//     </>
//   );
// }


import TopNavbar from './TopNavbar';
import TriviaScreen from './TriviaScreen'; // <-- import your new screen
// import other screens if you want later

export default function App() {
  // Hardcode current screen for now
  const currentScreen = 'trivia';

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'trivia':
        return <TriviaScreen />; // <-- show trivia screen
      default:
        return <TriviaScreen />; // fallback to trivia for dev
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
