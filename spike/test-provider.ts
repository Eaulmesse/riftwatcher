import { RiotLocalProvider } from '../src/services/riotLocalProvider';

console.log('🧪 Test du RiotLocalProvider\n');

const provider = new RiotLocalProvider();

// Écouter les changements d'état
provider.on('stateChanged', (data) => {
  console.log(`\n🎯 ÉVÉNEMENT REÇU:`);
  console.log(`   ${data.oldState} → ${data.newState}`);
  console.log(`   Timestamp: ${new Date(data.timestamp).toLocaleTimeString()}\n`);
});

// Démarrer le heartbeat
provider.start();

console.log('⏱️  Heartbeat actif. Lancez League et entrez en partie...');
console.log('   (Ctrl+C pour arrêter)\n');

// Arrêter proprement quand on quitte (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n\n🛑 Arrêt du test...');
  provider.stop();
  process.exit(0);
});