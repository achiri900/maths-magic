import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './components/HomePage';
import MathGame from './components/MathGame';
import MultiplyGame from './components/MultiplyGame';
import OrderGame from './components/OrderGame';
import MemoryGame from './components/MemoryGame';
import GuessNumber from './components/GuessNumber';
import PatternGame from './components/PatternGame';

type GameType = 'home' | 'math' | 'multiply' | 'order' | 'memory' | 'guess' | 'pattern';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  const handleSelectGame = (game: string) => {
    setCurrentGame(game as GameType);
  };

  const handleBack = () => {
    setCurrentGame('home');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentGame === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onSelectGame={handleSelectGame} />
          </motion.div>
        )}
        {currentGame === 'math' && (
          <motion.div
            key="math"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <MathGame onBack={handleBack} />
          </motion.div>
        )}
        {currentGame === 'multiply' && (
          <motion.div
            key="multiply"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <MultiplyGame onBack={handleBack} />
          </motion.div>
        )}
        {currentGame === 'order' && (
          <motion.div
            key="order"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <OrderGame onBack={handleBack} />
          </motion.div>
        )}
        {currentGame === 'memory' && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <MemoryGame onBack={handleBack} />
          </motion.div>
        )}
        {currentGame === 'guess' && (
          <motion.div
            key="guess"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <GuessNumber onBack={handleBack} />
          </motion.div>
        )}
        {currentGame === 'pattern' && (
          <motion.div
            key="pattern"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <PatternGame onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
