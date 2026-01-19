import { EventEmitter } from 'events';
import { RiotApiClient } from './riotApiClient';
import { GameState } from '../types/game-state.types';
import { GameSessionService } from './GamesSesssionServices';

class RiotLocalProvider extends EventEmitter {
    private client: RiotApiClient;
    private sessionService: GameSessionService;
    private currentState: GameState;
    private heartbeatInterval: NodeJS.Timer | null;

    constructor() {
        super();
        this.client = new RiotApiClient();
        this.sessionService = new GameSessionService();
        this.currentState = GameState.OFFLINE;
        this.heartbeatInterval = null;
    }

    start(): void {
        if (this.heartbeatInterval) {
            console.log('⚠️  Heartbeat déjà démarré');
            return;
        }
        
        console.log('▶️  Démarrage du heartbeat (2s)');
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
        this.sessionService.disconnect();
    }

    private async checkGameState(): Promise<void> {
        try {
            const player = await this.client.getActivePlayer();
            
            // Si on était OFFLINE et qu'on passe IN_GAME → créer session
            if (this.currentState !== GameState.IN_GAME) {
                await this.sessionService.startSession(
                    player.summonerName,
                    player.championName
                );
            }

            // Enregistrer le snapshot
            await this.sessionService.createSnapshot({
                level: player.level,
                currentGold: player.currentGold,
                totalGold: player.currentGold, // TODO: récupérer le vrai totalGold
                cs: undefined, // TODO: récupérer les CS
            });

            console.log(`📊 [IN_GAME] ${player.summonerName} - Level ${player.level} - ${player.currentGold}g`);
            this.setState(GameState.IN_GAME);
            
        } catch (error: any) {
            // Si on était IN_GAME et qu'on passe OFFLINE → terminer session
            if (this.currentState === GameState.IN_GAME) {
                await this.sessionService.endSession();
            }
            
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
    
        const oldState = this.currentState;
        this.currentState = state;
        
        console.log(`🔄 État changé: ${oldState} -> ${state}`);
        this.emit('stateChanged', {oldState, newState: state, timestamp: Date.now()});
    }

    getCurrentState(): GameState {
        return this.currentState;
    }

    async getActivePlayerData() {
        return this.client.getActivePlayer();
    }
    
    getCurrentSessionData() {
        return this.sessionService.getCurrentSession();
    }
    
    async getSessionHistoryData(limit: number = 10) {
        return this.sessionService.getSessionHistory(limit);
    }
}

export { RiotLocalProvider };