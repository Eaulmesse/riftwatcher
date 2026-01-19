import { GameState } from './game-state.types';
import { ActivePlayerData } from './riot-api.types';

// Types pour les réponses IPC
export interface GameStateChangedEvent {
  oldState: GameState;
  newState: GameState;
  timestamp: number;
}

export interface GameSessionData {
  id: string;
  startTime: Date;
  endTime: Date | null;
  summonerName: string;
  champion: string | null;
  result: string | null;
  snapshots?: SnapshotData[];
  events?: GameEventData[];
}

export interface SnapshotData {
  id: string;
  sessionId: string;
  timestamp: Date;
  level: number;
  currentGold: number;
  totalGold: number;
  cs: number | null;
}

export interface GameEventData {
  id: string;
  sessionId: string;
  timestamp: Date;
  eventType: string;
  eventData: string;
}

// Types pour l'API window.electron
export interface GameAPI {
  getState: () => Promise<GameState>;
  getActivePlayer: () => Promise<ActivePlayerData | null>;
  getCurrentSession: () => Promise<GameSessionData | null>;
  getSessionHistory: (limit?: number) => Promise<GameSessionData[]>;
  onStateChanged: (callback: (data: GameStateChangedEvent) => void) => () => void;
}

export interface ElectronAPI {
  game: GameAPI;
  ipcRenderer: {
    sendMessage: (channel: string, ...args: unknown[]) => void;
    on: (channel: string, func: (...args: unknown[]) => void) => () => void;
    once: (channel: string, func: (...args: unknown[]) => void) => void;
  };
}