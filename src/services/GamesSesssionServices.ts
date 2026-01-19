import { PrismaClient } from '../generated/prisma';
import type { GameSession, Snapshot } from '../generated/prisma';

class GameSessionService {
  private prisma: PrismaClient;
  private currentSession: GameSession | null = null;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async startSession(summonerName: string, champion?: string): Promise<GameSession> {
    this.currentSession = await this.prisma.gameSession.create({
      data: {
        summonerName,
        champion,
        startTime: new Date(),
      },
    });

    console.log(`🎮 Session démarrée: ${this.currentSession.id}`);
    return this.currentSession;
  }

  async createSnapshot(data: {
    level: number;
    currentGold: number;
    totalGold: number;
    cs?: number;
  }): Promise<Snapshot | null> {
    if (!this.currentSession) {
      console.warn('⚠️  Pas de session active pour créer un snapshot');
      return null;
    }

    const snapshot = await this.prisma.snapshot.create({
      data: {
        sessionId: this.currentSession.id,
        timestamp: new Date(),
        level: data.level,
        currentGold: data.currentGold,
        totalGold: data.totalGold,
        cs: data.cs,
      },
    });

    return snapshot;
  }

  async endSession(result?: 'WIN' | 'LOSS' | 'REMAKE'): Promise<void> {
    if (!this.currentSession) {
      console.warn('⚠️  Pas de session active à terminer');
      return;
    }

    await this.prisma.gameSession.update({
      where: { id: this.currentSession.id },
      data: {
        endTime: new Date(),
        result,
      },
    });

    console.log(`🏁 Session terminée: ${this.currentSession.id} (${result})`);
    this.currentSession = null;
  }

  getCurrentSession(): GameSession | null {
    return this.currentSession;
  }

  async getSessionHistory(limit: number = 10): Promise<GameSession[]> {
    return this.prisma.gameSession.findMany({
      take: limit,
      orderBy: { startTime: 'desc' },
      include: {
        snapshots: true,
        events: true,
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export { GameSessionService };