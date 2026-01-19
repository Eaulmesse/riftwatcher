import { EventEmitter } from 'events';
import { RiotApiClient } from './riotApiClient';
import { GameState } from '../types/game-state.types';


class RiotLocalProvider  extends EventEmitter {
    private client: RiotApiClient;
    private currentState: GameState;
    private heartbeatInterval: NodeJS.Timer | null;

    constructor() {
        super();
        this.client = new RiotApiClient();
        this.currentState = GameState.OFFLINE;
        this.heartbeatInterval = null;
    }

    start(): void {
        if (this.heartbeatInterval) {
            console.log('⚠️  Heartbeat déjà démarré');
            return;
        }
        
        console.log('▶️  Démarrage du heartbeat (2s)');
        
        // Check immédiat au démarrage
        this.checkGameState();
        
        this.heartbeatInterval = setInterval(() => {
            this.checkGameState();
        }, 2000);
    }

    stop(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval as NodeJS.Timeout);
            this.heartbeatInterval = null;
        }
    }

    private async checkGameState(): Promise<void> {
        try {
            const player = await this.client.getActivePlayer();
            console.log(`📊 [IN_GAME] ${player.summonerName} - Level ${player.level} - ${player.currentGold}g`);
            this.setState(GameState.IN_GAME);
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED') {
                this.setState(GameState.OFFLINE);
            } else {
                console.log(`⚠️  Erreur API: ${error.message}`);
                this.setState(GameState.OFFLINE);
            }
        }
    }

    private setState(state: GameState): void {
        if (this.currentState === state) return;
    
        const oldState = this.currentState; // Sauvegarder l'ancien état
        this.currentState = state;
        
        console.log(`🔄 État changé: ${oldState} -> ${state}`);
        this.emit('stateChanged', {oldState, newState: state, timestamp: Date.now()});
    }

    getCurrentState(): GameState {
        return this.currentState;
    }
    
}

export { RiotLocalProvider };