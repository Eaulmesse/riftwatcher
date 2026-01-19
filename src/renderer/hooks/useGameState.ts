import { useState, useEffect } from 'react';
import { GameState } from '../../types/game-state.types';
import { ActivePlayerData } from '../../types/riot-api.types';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('OFFLINE' as GameState);
  const [playerData, setPlayerData] = useState<ActivePlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer l'état
    const fetchGameState = async () => {
      try {
        const state = await window.electron.game.getState();
        setGameState(state);

        if (state === 'IN_GAME') {
          const player = await window.electron.game.getActivePlayer();
          setPlayerData(player);
        } else {
          setPlayerData(null);
        }
      } catch (error) {
        console.error('Erreur fetchGameState:', error);
      } finally {
        setLoading(false);
      }
    };

    // Polling toutes les 2 secondes
    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);

    // Écouter les changements d'état en temps réel
    const unsubscribe = window.electron.game.onStateChanged((data) => {
      console.log('État changé:', data);
      setGameState(data.newState);
    });

    // Cleanup
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return { gameState, playerData, loading };
}
