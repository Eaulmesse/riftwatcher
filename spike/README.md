# Phase 0 - Tests de Faisabilité

Ce dossier contient les scripts de validation technique pour le projet **RiftWatcher Engine**.

## Objectif

Valider les hypothèses techniques **avant** d'investir dans l'architecture complète :

1. ✅ L'API Riot Live Client est accessible avec bypass SSL
2. ✅ La latence permet un polling toutes les 2 secondes
3. ✅ Data Dragon contient toutes les données nécessaires

## Prérequis

- Node.js installé
- TypeScript (`npm install -g typescript ts-node`)
- **Pour les tests 1 et 2** : League of Legends lancé ET en partie (pas dans le lobby)

## Scripts

> **Note:** Utilisez `npx ts-node` si ts-node n'est pas installé globalement.

### 01 - Test de connexion API Riot

```bash
npx ts-node spike/01-test-riot-api-connection.ts
```

**Teste:**
- Le bypass du certificat SSL auto-signé
- L'accès à tous les endpoints principaux (`/liveclientdata/...`)
- La structure des données retournées

**Résultat attendu:** 
- ✅ Si en partie : Tous les endpoints répondent avec du JSON
- ❌ Si hors partie : Erreur ECONNREFUSED (normal)

---

### 02 - Benchmark de latence

```bash
npx ts-node spike/02-test-latency-benchmark.ts
```

**Teste:**
- La latence min/max/moyenne sur 20 requêtes
- L'impact de différentes fréquences de polling (1s, 2s, 5s)
- La stabilité de la connexion

**Résultat attendu:**
- Latence moyenne < 50ms (local)
- Aucune erreur de timeout

---

### 03 - Validation Data Dragon

```bash
npx ts-node spike/03-test-datadragon.ts
```

**Teste:**
- Le téléchargement des assets de Data Dragon
- La présence des items, champions, sorts invocateurs
- La version actuelle du jeu

**Résultat attendu:**
- Version actuelle détectée (ex: `14.1.1`)
- +150 champions, +200 items disponibles
- Données en français (`fr_FR`)

---

## Résultats Attendus

Si **tous les tests passent**, vous pouvez passer à la **Phase 1** en toute confiance.

Si un test échoue :
- **Test 1/2 échoue** : Vérifiez que LoL est bien lancé **en partie**
- **Test 3 échoue** : Problème de réseau ou Data Dragon en maintenance

## Notes Techniques

### Pourquoi bypass le SSL ?

L'API Riot Live Client utilise HTTPS avec un **certificat auto-signé**. Node.js rejette ces certificats par défaut. On utilise :

```typescript
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});
```

⚠️ **Sécurité** : OK pour une API locale (`127.0.0.1`), **JAMAIS** pour une API externe.

### Pourquoi Data Dragon et pas l'API officielle ?

- **Data Dragon** : Assets statiques, pas de clé API requise, rapide
- **API Riot officielle** : Requiert une clé, rate-limited, pour les données de comptes/matchs

Pour RiftWatcher, Data Dragon suffit pour :
- Items (prix, stats, icônes)
- Champions (noms, rôles)
- Sorts invocateurs

L'API Live Client fournit le reste (or, XP, events).

---

## Prochaines Étapes

Une fois la Phase 0 validée :

→ **Phase 1** : Créer le module `RiotLocalProvider` avec le heartbeat
→ **Phase 2** : Setup de la base SQLite + schéma Prisma
→ **Phase 3** : Interface temps réel

---

**Créé le:** 2026-01-19  
**Projet:** RiftWatcher Engine  
**Auteur:** Vous
