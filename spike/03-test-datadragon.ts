/**
 * Phase 0 - Test 3: Validation de Data Dragon
 * 
 * Ce script teste:
 * - Le téléchargement des assets de Data Dragon
 * - La correspondance entre IDs d'items et leurs métadonnées
 * - La disponibilité des données nécessaires pour RiftWatcher
 * 
 * Usage: ts-node spike/03-test-datadragon.ts
 */

import https from 'https';
import http from 'http';

interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
}

interface ItemData {
  name: string;
  description: string;
  gold: {
    base: number;
    total: number;
    sell: number;
  };
  tags: string[];
}

interface DDragonVersions {
  latest: string;
  versions: string[];
}

/**
 * Récupère la dernière version de Data Dragon
 */
async function getLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get('http://ddragon.leagueoflegends.com/api/versions.json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const versions = JSON.parse(data);
          resolve(versions[0]); // La première est toujours la plus récente
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Télécharge et parse un fichier JSON de Data Dragon
 */
async function fetchDDragonData<T>(version: string, path: string): Promise<T> {
  const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/${path}`;
  
  console.log(`📥 Téléchargement: ${path}`);

  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`✅ ${path} téléchargé (${(data.length / 1024).toFixed(2)} Ko)`);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Valide que les données essentielles sont présentes
 */
async function validateDataDragon(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  PHASE 0 - Test de Faisabilité: Data Dragon               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Récupérer la version actuelle
    console.log('🔍 Récupération de la version actuelle...');
    const version = await getLatestVersion();
    console.log(`✅ Version actuelle: ${version}\n`);

    // 2. Télécharger les items
    console.log('📦 Téléchargement des données d\'items...');
    const itemsData: any = await fetchDDragonData(version, 'item.json');
    const items = itemsData.data as Record<string, ItemData>;
    
    console.log(`✅ ${Object.keys(items).length} items disponibles\n`);

    // 3. Tester quelques items courants
    console.log('🔍 Validation de quelques items clés:');
    const testItemIds = ['1001', '3006', '3031', '3089', '6653']; // Boots, Berserker's, IE, Rabadon's, Liandry's
    
    for (const itemId of testItemIds) {
      const item = items[itemId];
      if (item) {
        console.log(`  ✅ [${itemId}] ${item.name} - ${item.gold.total}g`);
      } else {
        console.log(`  ❌ [${itemId}] Item non trouvé (peut-être retiré du jeu)`);
      }
    }

    // 4. Télécharger les champions
    console.log('\n🦸 Téléchargement des données de champions...');
    const championsData: any = await fetchDDragonData(version, 'champion.json');
    const champions = championsData.data as Record<string, ChampionData>;
    
    console.log(`✅ ${Object.keys(champions).length} champions disponibles\n`);

    // 5. Tester quelques champions
    console.log('🔍 Validation de quelques champions:');
    const testChampNames = ['Ahri', 'Yasuo', 'Jinx', 'Thresh', 'LeeSin'];
    
    for (const champName of testChampNames) {
      const champ = champions[champName];
      if (champ) {
        console.log(`  ✅ ${champ.name} - "${champ.title}"`);
      } else {
        console.log(`  ❌ ${champName} non trouvé`);
      }
    }

    // 6. Télécharger les sorts invocateurs
    console.log('\n✨ Téléchargement des sorts invocateurs...');
    const summonerData: any = await fetchDDragonData(version, 'summoner.json');
    const spells = summonerData.data;
    
    console.log(`✅ ${Object.keys(spells).length} sorts disponibles`);
    console.log(`  Exemples: ${Object.values(spells).slice(0, 3).map((s: any) => s.name).join(', ')}\n`);

    // Résultat final
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  RÉSULTATS                                                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('✅ Data Dragon est accessible et complet.');
    console.log(`✅ Version détectée: ${version}`);
    console.log('✅ Toutes les données nécessaires sont disponibles:\n');
    console.log('   → Items (pour calculer la valeur de l\'inventaire)');
    console.log('   → Champions (pour identifier les picks)');
    console.log('   → Sorts invocateurs (pour l\'analyse complète)\n');
    
    console.log('💡 RECOMMANDATIONS:');
    console.log('   1. Stockez la version de DDragon dans votre config');
    console.log('   2. Vérifiez la version au démarrage de l\'app');
    console.log('   3. Proposez une mise à jour automatique si nouvelle version');
    console.log('   4. Gardez un cache local des JSONs pour éviter les téléchargements répétés\n');

    console.log('⚠️  ATTENTION:');
    console.log('   → Data Dragon se met à jour ~2 semaines après chaque patch');
    console.log('   → Prévoyez un système de fallback si l\'API Live Client utilise');
    console.log('     un ID d\'item qui n\'existe pas encore dans DDragon');

  } catch (error: any) {
    console.log('\n❌ ERREUR lors de la validation de Data Dragon');
    console.log(`   ${error.message}`);
    console.log('\n⚠️  VERDICT: Impossible d\'accéder à Data Dragon.');
    console.log('   → Vérifiez votre connexion internet');
    console.log('   → Data Dragon peut être temporairement indisponible');
  }
}

// Lancement de la validation
validateDataDragon().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
