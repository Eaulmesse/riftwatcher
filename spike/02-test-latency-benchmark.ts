/**
 * Phase 0 - Test 2: Benchmark de latence et fréquence de polling
 * 
 * Ce script mesure:
 * - La latence moyenne/min/max des requêtes
 * - L'impact d'un polling à différentes fréquences (1s, 2s, 5s)
 * - La stabilité de la connexion sur une période prolongée
 * 
 * Usage: ts-node spike/02-test-latency-benchmark.ts
 */

import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

interface LatencyStats {
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  samples: number[];
}

/**
 * Effectue une requête et mesure sa latence
 */
async function measureLatency(endpoint: string): Promise<number> {
  const url = `https://127.0.0.1:2999${endpoint}`;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent: httpsAgent }, (res) => {
      const latency = Date.now() - startTime;
      
      // On consomme la réponse pour libérer la socket
      res.on('data', () => {});
      res.on('end', () => resolve(latency));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Calcule les statistiques à partir d'un tableau de latences
 */
function calculateStats(samples: number[]): LatencyStats {
  const sorted = [...samples].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: Math.round(sum / sorted.length),
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    samples: sorted,
  };
}

/**
 * Test de latence avec un nombre donné d'échantillons
 */
async function benchmarkLatency(
  endpoint: string,
  sampleCount: number,
  intervalMs: number
): Promise<LatencyStats> {
  console.log(`\n📊 Benchmark: ${sampleCount} requêtes espacées de ${intervalMs}ms`);
  console.log('━'.repeat(60));

  const latencies: number[] = [];
  let errors = 0;

  for (let i = 0; i < sampleCount; i++) {
    try {
      const latency = await measureLatency(endpoint);
      latencies.push(latency);
      
      // Affichage d'une barre de progression
      const progress = Math.floor((i + 1) / sampleCount * 20);
      const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);
      process.stdout.write(`\r[${bar}] ${i + 1}/${sampleCount} - Dernière: ${latency}ms`);
      
    } catch (error) {
      errors++;
    }

    // Attendre avant la prochaine requête
    if (i < sampleCount - 1) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  console.log('\n');

  if (latencies.length === 0) {
    throw new Error('Aucune requête n\'a réussi');
  }

  const stats = calculateStats(latencies);
  
  console.log(`✅ Réussites: ${latencies.length}/${sampleCount}`);
  console.log(`❌ Erreurs: ${errors}/${sampleCount}`);
  console.log(`⚡ Min: ${stats.min}ms`);
  console.log(`📈 Max: ${stats.max}ms`);
  console.log(`📊 Moyenne: ${stats.avg}ms`);
  console.log(`📌 Médiane: ${stats.median}ms`);
  console.log(`🔝 P95: ${stats.p95}ms`);

  return stats;
}

/**
 * Teste différentes stratégies de polling
 */
async function testPollingStrategies(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  PHASE 0 - Test de Faisabilité: Benchmark de Latence      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const endpoint = '/liveclientdata/activeplayer';

  // Test 1: Polling rapide (1 seconde)
  console.log('\n🔥 Scénario 1: Polling agressif (1 requête/seconde)');
  try {
    const stats1s = await benchmarkLatency(endpoint, 20, 1000);
    
    if (stats1s.avg > 100) {
      console.log('⚠️  Latence élevée détectée. Risque de lag avec ce polling.');
    } else {
      console.log('✅ Latence acceptable pour du polling à 1s.');
    }
  } catch (error: any) {
    console.log(`❌ Échec: ${error.message}`);
  }

  // Pause entre les tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Polling modéré (2 secondes) - Votre baseline
  console.log('\n⚖️  Scénario 2: Polling modéré (1 requête/2 secondes)');
  try {
    const stats2s = await benchmarkLatency(endpoint, 20, 2000);
    
    console.log('✅ C\'est votre baseline recommandée pour la Phase 1.');
  } catch (error: any) {
    console.log(`❌ Échec: ${error.message}`);
  }

  // Pause entre les tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Polling léger (5 secondes)
  console.log('\n🐢 Scénario 3: Polling léger (1 requête/5 secondes)');
  try {
    const stats5s = await benchmarkLatency(endpoint, 10, 5000);
    
    console.log('ℹ️  Trop lent pour du temps réel, mais OK pour du monitoring passif.');
  } catch (error: any) {
    console.log(`❌ Échec: ${error.message}`);
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  RECOMMANDATIONS                                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('✅ Pour RiftWatcher, utilisez un polling à 2 secondes.');
  console.log('   → Bon compromis entre réactivité et charge système.');
  console.log('   → Ajustable dynamiquement selon les événements critiques.');
  console.log('\n💡 Optimisation future:');
  console.log('   → Polling à 1s pendant les teamfights (détection via events)');
  console.log('   → Polling à 5s en phase de farm/laning calme');
}

// Lancement du benchmark
testPollingStrategies().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
