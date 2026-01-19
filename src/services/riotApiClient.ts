// ÉTAPE 1 : Imports
import https from 'https';
import { riotHttpsAgent } from '../utils/https-agent';
import { 
  ActivePlayerData, 
  PlayerData, 
  RiotApiEndpoints 
} from '../types/riot-api.types';

// ÉTAPE 2 : Classe
class RiotApiClient {
    private baseUrl = 'https://127.0.0.1:2999';
  
  
    private async request<T>(endpoint: RiotApiEndpoints): Promise<T> {
        return new Promise((resolve, reject) => {
            const req = https.get(`${this.baseUrl}${endpoint}`, { agent: riotHttpsAgent }, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                data += chunk;
                });
                
                res.on('end', () => {
                try {
                    const parsed = JSON.parse(data) as T;
                    resolve(parsed);
                } catch (error) {
                    reject(new Error('JSON parsing failed'));
                }
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.setTimeout(5000);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }
    
    
    async getActivePlayer(): Promise<ActivePlayerData> {
        return this.request<ActivePlayerData>(RiotApiEndpoints.ACTIVE_PLAYER);
    }
    
    async getPlayerList(): Promise<PlayerData[]> {
        return this.request<PlayerData[]>(RiotApiEndpoints.PLAYER_LIST);
    }
}


export { RiotApiClient };