# L'Énigme des 54 Pourcents

Une chasse au trésor virtuelle composée de 7 mini-jeux à résoudre séquentiellement. L'indice final n'est révélé qu'une fois toutes les épreuves terminées.

## Les Épreuves

| # | Jeu | Description |
|---|-----|-------------|
| 1 | L'Énigme du Sphinx | Résolvez 3 devinettes pour franchir le passage |
| 2 | Le Code Secret | Déchiffrez un message codé avec un code de César |
| 3 | Le Jeu de Mémoire | Retrouvez les 8 paires d'artefacts cachées |
| 4 | Le Taquin Maudit | Remettez les tuiles dans le bon ordre |
| 5 | Le Labyrinthe Perdu | Naviguez dans un labyrinthe avec brouillard de guerre |
| 6 | La Séquence Sacrée | Reproduisez des séquences de couleurs (Simon) |
| 7 | Le Pendu de l'Aventurier | Devinez 3 mots d'affilée au pendu |

## Stack technique

- **React 19** + **Vite 6**
- CSS pur (pas de framework CSS)
- Déploiement GitHub Pages via GitHub Actions
- Aucune dépendance backend — 100% statique

## Développement local

```bash
npm install
npm run dev
```

Le serveur de développement démarre sur `http://localhost:5173`.

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement

Le déploiement est automatique via GitHub Actions sur chaque push sur `main`. Le workflow :

1. Installe les dépendances (`npm ci`)
2. Build le projet (`npm run build`)
3. Déploie le dossier `dist/` sur GitHub Pages

> **Note** : pensez à activer GitHub Pages (source: GitHub Actions) dans les paramètres du dépôt.

## Structure du projet

```
src/
  context/GameContext.jsx    # État de progression + persistance localStorage
  components/
    Layout.jsx               # En-tête, barre de progression, pied de page
    GameContainer.jsx        # Wrapper verrouillé/actif/terminé par jeu
    FinalClue.jsx            # Révélation de l'indice final
  games/
    index.js                 # Registre central des jeux
    RiddleGame.jsx           # Épreuve 1
    CipherGame.jsx           # Épreuve 2
    MemoryGame.jsx           # Épreuve 3
    SlidingPuzzle.jsx        # Épreuve 4
    MazeGame.jsx             # Épreuve 5
    SimonGame.jsx            # Épreuve 6
    HangmanGame.jsx          # Épreuve 7
```
