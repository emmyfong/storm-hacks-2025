import React from 'react';
import './TopNavbar.css';

interface TopNavbarProps {
  playerName?: string;
  lobbyCode?: string;
  playerCount?: number;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ 
  playerName, 
  lobbyCode, 
  playerCount 
}) => {
  return (
    <nav className="top-navbar">
      <div className="navbar-container">
        {/* Left side - Logo/Title */}
        <div className="navbar-left">
          <h1 className="navbar-title">Witch Dog</h1>
        </div>

        {/* Center - Game Info */}
        <div className="navbar-center">
          {lobbyCode && (
            <div className="game-info">
              <span className="lobby-code">Lobby: {lobbyCode}</span>
              {playerCount !== undefined && (
                <span className="player-count">({playerCount} players)</span>
              )}
            </div>
          )}
        </div>

        {/* Right side - Player Info & Actions */}
        <div className="navbar-right">
          {playerName && (
            <div className="player-info">
              <span className="player-name">Welcome, {playerName}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
