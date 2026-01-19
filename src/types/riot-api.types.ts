const enum RiotApiEndpoints {
    ALL_GAME_DATA = '/liveclientdata/allgamedata',
    ACTIVE_PLAYER = '/liveclientdata/activeplayer',
    PLAYER_LIST = '/liveclientdata/playerlist',
    GAME_STATS = '/liveclientdata/gamestats',
    EVENT_DATA = '/liveclientdata/eventdata',
}

interface ActivePlayerData {
    championStats: {
        currentHealth: number;
        maxHealth: number;
    },
    championName: string;
    currentGold: number;
    level: number;
    summonerName: string;
    minionsKilled: number;
}

interface PlayerData {
    championName: string;
    summonerName: string;
    team: 'ORDER' | 'CHAOS';
    position: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';
    level: number;
    scores: {
        kills: number;
        deaths: number;
        assists: number;
    }
}

interface GameEvent {
    EventId: number;
    EventName: string;
    EventTime: number;
    KillerName?: string;
    VictimName?: string;
}


export { RiotApiEndpoints, ActivePlayerData, PlayerData, GameEvent };