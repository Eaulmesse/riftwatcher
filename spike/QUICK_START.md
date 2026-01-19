# Quick Start - Tests Phase 0

## 🚀 Lancer tous les tests

### Prérequis
- Node.js installé
- Pour les tests 1 et 2 : **League of Legends lancé EN PARTIE**

### Commandes Rapides

```bash
# Test 1 : Connexion API Riot (nécessite League en partie)
npx ts-node spike/01-test-riot-api-connection.ts

# Test 2 : Benchmark de latence (nécessite League en partie)
npx ts-node spike/02-test-latency-benchmark.ts

# Test 3 : Validation Data Dragon (fonctionne sans League)
npx ts-node spike/03-test-datadragon.ts
```

---

## 📋 Résultats Attendus

### ✅ Test 1 - Si League EST en partie
```
✅ Succès: 5/5
✅ VERDICT: Tous les endpoints sont accessibles !
```

### ❌ Test 1 - Si League N'EST PAS en partie
```
❌ Échecs: 5/5
⚠️  VERDICT: L'API n'est pas accessible.
   → Assurez-vous que League of Legends est lancé ET en partie.
```

**C'est normal ! L'API n'existe que pendant une partie.**

### ✅ Test 3 - Data Dragon (toujours)
```
✅ Data Dragon est accessible et complet.
✅ Version détectée: 16.1.1
```

---

## 🎮 Comment lancer une partie de test

1. Ouvrir League of Legends
2. Créer une **Partie Personnalisée**
3. Ajouter des bots si besoin
4. **Lancer la partie**
5. Attendre d'être en jeu (pas dans l'écran de chargement)
6. Lancer les scripts de test

⚠️ **Important:** L'API n'est active que pendant la partie, pas dans :
- Le lobby
- La sélection des champions
- L'écran de chargement
- L'écran de victoire/défaite

---

## 🔧 Troubleshooting

### Erreur: "ts-node n'est pas reconnu"
**Solution:** Utiliser `npx ts-node` au lieu de `ts-node`

### Erreur: "ECONNREFUSED"
**Solution:** League n'est pas en partie. Voir section ci-dessus.

### Erreur: "HTTP 404" sur Data Dragon
**Solution:** Problème réseau ou Data Dragon en maintenance. Réessayer plus tard.

---

## 📊 Voir les résultats complets

Consultez `RESULTATS_PHASE_0.md` pour l'analyse complète des tests.
