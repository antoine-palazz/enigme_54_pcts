import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <Layout />
      </div>
    </GameProvider>
  );
}
