import RiddleGame from './RiddleGame';
import CipherGame from './CipherGame';
import MemoryGame from './MemoryGame';
import SlidingPuzzle from './SlidingPuzzle';
import MazeGame from './MazeGame';
import SimonGame from './SimonGame';
import HangmanGame from './HangmanGame';

/**
 * Central registry of all games in sequential order.
 * Each entry defines the game metadata and component.
 */
const GAMES = [
  {
    id: 'riddle',
    title: "L'Énigme du Sphinx",
    description: 'Le Sphinx vous barre la route… Résolvez ses énigmes pour passer.',
    icon: '🗿',
    component: RiddleGame,
  },
  {
    id: 'cipher',
    title: 'Le Code Secret',
    description: 'Un message chiffré a été intercepté. Trouvez la clé pour le déchiffrer.',
    icon: '🔐',
    component: CipherGame,
  },
  {
    id: 'memory',
    title: 'Le Jeu de Mémoire',
    description: "Retrouvez les paires d'artefacts cachées sous les cartes.",
    icon: '🃏',
    component: MemoryGame,
  },
  {
    id: 'sliding',
    title: 'Le Taquin Maudit',
    description: 'Remettez les pièces dans le bon ordre pour briser la malédiction.',
    icon: '🧩',
    component: SlidingPuzzle,
  },
  {
    id: 'maze',
    title: 'Le Labyrinthe Perdu',
    description: 'Trouvez la sortie de ce labyrinthe oublié depuis des siècles.',
    icon: '🏛️',
    component: MazeGame,
  },
  {
    id: 'simon',
    title: 'La Séquence Sacrée',
    description: 'Reproduisez la mélodie des pierres anciennes sans vous tromper.',
    icon: '🔮',
    component: SimonGame,
  },
  {
    id: 'hangman',
    title: "Le Pendu de l'Aventurier",
    description: "Devinez les mots secrets avant qu'il ne soit trop tard.",
    icon: '⚔️',
    component: HangmanGame,
  },
];

export default GAMES;
