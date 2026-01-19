/**
 * Phase 0 - Test 1: Vérification de la connexion à l'API Riot Live Client
 * 
 * Ce script teste:
 * - Le bypass du certificat SSL auto-signé
 * - La disponibilité de l'API sur https://127.0.0.1:2999
 * - La structure des données retournées
 * 
 * Usage: ts-node spike/01-test-riot-api-connection.ts
 */

import https from 'https';

// Agent HTTPS qui ignore les erreurs de certificat (nécessaire pour l'API Riot)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Bypass SSL certificate validation
});

/**
 * Test de connexion basique à l'API
 */
async function testConnection(endpoint: string): Promise<void> {
  const url = `https://127.0.0.1:2999${endpoint}`;
  
  console.log(`\n🔍 Test de connexion: ${url}`);
  console.log('━'.repeat(60));

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent: httpsAgent }, (res) => {
      const latency = Date.now() - startTime;
      
      console.log(`✅ Statut: ${res.statusCode}`);
      console.log(`⏱️  Latence: ${latency}ms`);
      console.log(`📦 Headers:`, res.headers);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`📊 Données reçues (aperçu):`);
          console.log(JSON.stringify(parsed, null, 2).substring(0, 500) + '...\n');
          resolve();
        } catch (error) {
          console.log(`⚠️  Réponse brute:`, data.substring(0, 200));
          resolve();
        }
      });
    });

    req.on('error', (error: NodeJS.ErrnoException) => {
      const latency = Date.now() - startTime;
      console.log(`❌ Erreur après ${latency}ms`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  L'API n'est pas disponible. League of Legends est-il lancé en partie ?`);
      } else if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.log(`⚠️  Erreur SSL détectée (normale si l'agent n'est pas configuré)`);
      } else {
        console.log(`⚠️  ${error.message}`);
      }
      
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout de la requête');
      req.destroy();
      reject(new Error('Timeout'));
    });

    // Timeout de 5 secondes
    req.setTimeout(5000);
  });
}

/**
 * Test de tous les endpoints principaux de l'API
 */
async function runTests(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  PHASE 0 - Test de Faisabilité: API Riot Live Client      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const endpoints = [
    '/liveclientdata/allgamedata',     // Toutes les données de la partie
    '/liveclientdata/activeplayer',    // Données du joueur actif
    '/liveclientdata/playerlist',      // Liste des joueurs
    '/liveclientdata/gamestats',       // Stats générales de la partie
    '/liveclientdata/eventdata',       // Events (kills, objectives, etc.)
  ];

  let successCount = 0;
  let failCount = 0;

  for (const endpoint of endpoints) {
    try {
      await testConnection(endpoint);
      successCount++;
    } catch (error) {
      failCount++;
    }
    
    // Pause de 100ms entre chaque requête pour ne pas marteler l'API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  RÉSULTATS                                                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`✅ Succès: ${successCount}/${endpoints.length}`);
  console.log(`❌ Échecs: ${failCount}/${endpoints.length}`);
  
  if (failCount === endpoints.length) {
    console.log('\n⚠️  VERDICT: L\'API n\'est pas accessible.');
    console.log('   → Assurez-vous que League of Legends est lancé ET en partie.');
    console.log('   → L\'API Live Client n\'est disponible qu\'en jeu, pas dans le lobby.');
  } else if (successCount === endpoints.length) {
    console.log('\n✅ VERDICT: Tous les endpoints sont accessibles !');
    console.log('   → Le bypass SSL fonctionne correctement.');
    console.log('   → Vous pouvez passer à la Phase 1.');
  } else {
    console.log('\n⚠️  VERDICT: Résultats mitigés.');
    console.log('   → Certains endpoints sont accessibles, d\'autres non.');
    console.log('   → Vérifiez les logs ci-dessus pour plus de détails.');
  }
}

// Lancement des tests
runTests().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
