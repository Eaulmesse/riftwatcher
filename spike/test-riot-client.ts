import { log } from 'console';
import { RiotApiClient } from '../src/services/riotApiClient';

async function testClient() {
  console.log('🧪 Test du RiotApiClient\n');
  
  const client = new RiotApiClient();
  
  try {
    console.log('📡 Tentative de connexion à l\'API Riot...');
    const player = await client.getActivePlayer();
    console.log(player);
    console.log('✅ SUCCÈS ! Données reçues :');
    console.log(`   Champion: ${player.championName}`);
    console.log(`   Or actuel: ${player.currentGold}g`);
    console.log(`   Niveau: ${player.level}`);
    console.log(`   Santé: ${player.championStats.currentHealth}/${player.championStats.maxHealth}`);
    
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ API non disponible');
      console.log('   → League of Legends n\'est pas en partie');
    } else if (error.message === 'Request timeout') {
      console.log('❌ Timeout');
      console.log('   → L\'API met trop de temps à répondre');
    } else {
      console.log('❌ Erreur:', error.message);
    }
  }
}

testClient();