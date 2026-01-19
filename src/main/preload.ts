// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'game:state-changed';

const electronHandler = {
  game: {
    // Récupérer l'état actuel du jeu
    getState: () => ipcRenderer.invoke('game:get-state'),
    
    // Récupérer les données du joueur actif
    getActivePlayer: () => ipcRenderer.invoke('game:get-active-player'),
    
    // Récupérer la session en cours
    getCurrentSession: () => ipcRenderer.invoke('game:get-current-session'),
    
    // Récupérer l'historique des sessions
    getSessionHistory: (limit?: number) => ipcRenderer.invoke('game:get-session-history', limit),
    
    // Event listener pour les changements d'état
    onStateChanged: (callback: (data: any) => void) => {
      const subscription = (_event: IpcRendererEvent, data: any) => callback(data);
      ipcRenderer.on('game:state-changed', subscription);
      
      // Retourner une fonction de cleanup
      return () => {
        ipcRenderer.removeListener('game:state-changed', subscription);
      };
    },
  },
  
  // Legacy - garder pour compatibilité
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;