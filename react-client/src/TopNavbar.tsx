import React from 'react';
import './css/TopNavbar.css';
import { useSocketContext } from './SocketContext.tsx';


const TopNavbar: React.FC = () => {
  const { lobbyCode, playerName, setCurrentScreen } = useSocketContext();

  const handleHomeClick = () => {
    setCurrentScreen('join');
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-container"> 
        {/* Left side - Logo/Title */}
        <div className="navbar-left">
          <h1 className="navbar-title">{playerName}</h1>
        </div>

        {/* Center - Game Info */}
        <div className="navbar-center" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <h1 className="navbar-title">Witch Dog</h1>
        </div>

        {/* Right side - Player Info & Actions */}
        <div className="navbar-right">
          <h1 className="navbar-title">Room Code: {lobbyCode}</h1>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
