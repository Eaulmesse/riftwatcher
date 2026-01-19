import { GameState } from '../../types/game-state.types';

interface GameStatusProps {
  state: GameState;
}

export function GameStatus({ state }: GameStatusProps) {
  const getStatusColor = () => {
    switch (state) {
      case 'IN_GAME':
        return '#0AC8B9'; // Bleu League of Legends
      case 'IN_MENU':
        return '#FFA500'; // Orange
      case 'OFFLINE':
      default:
        return '#666666'; // Gris
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'IN_GAME':
        return 'En Partie';
      case 'IN_MENU':
        return 'Dans le Menu';
      case 'OFFLINE':
      default:
        return 'Hors Ligne';
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: getStatusColor(),
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'white',
          animation: state === 'IN_GAME' ? 'pulse 2s infinite' : 'none',
        }}
      />
      {getStatusText()}
    </div>
  );
}
