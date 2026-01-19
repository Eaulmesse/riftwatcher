import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import { GameStatus } from './components/GameStatus';
import { LiveStats } from './components/LiveStats';
import './App.css';

function Dashboard() {
  const { gameState, playerData, loading } = useGameState();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Chargement de RiftWatcher...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1 style={{ margin: 0, fontSize: '32px', color: '#0AC8B9' }}>
          🎮 RiftWatcher
        </h1>
        <GameStatus state={gameState} />
      </header>

      <main className="main-content">
        {gameState === 'IN_GAME' && playerData ? (
          <LiveStats player={playerData} />
        ) : (
          <div className="offline-message">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚔️</div>
            <h2>En attente de partie...</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Lancez League of Legends et démarrez une partie pour voir vos
              statistiques en temps réel
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
