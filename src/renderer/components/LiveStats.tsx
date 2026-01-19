import { ActivePlayerData } from '../../types/riot-api.types';

interface LiveStatsProps {
  player: ActivePlayerData;
}

export function LiveStats({ player }: LiveStatsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* Carte Joueur */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', color: '#0AC8B9' }}>
          {player.summonerName}
        </h2>
        <p style={{ margin: '0', fontSize: '18px', color: '#fff' }}>
          Champion: <strong>{player.championName}</strong>
        </p>
      </div>

      {/* Statistiques en Temps Réel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Niveau */}
        <StatCard
          title="Niveau"
          value={player.level}
          icon="⚡"
          color="#FFD700"
        />

        {/* Or Actuel */}
        <StatCard
          title="Or Actuel"
          value={`${player.currentGold}g`}
          icon="💰"
          color="#FFA500"
        />

        {/* CS (Minions) */}
        <StatCard
          title="CS"
          value={player.minionsKilled || 0}
          icon="⚔️"
          color="#FF6B6B"
        />

        {/* Santé */}
        <StatCard
          title="Santé"
          value={`${player.championStats.currentHealth} / ${player.championStats.maxHealth}`}
          icon="❤️"
          color="#E74C3C"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          {title}
        </span>
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
