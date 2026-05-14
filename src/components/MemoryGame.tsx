import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Trophy, Star, Home } from 'lucide-react';

interface MemoryGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🐙', '🦄', '🦋', '🐞', '🌟', '🌈'];

function generateCards(level: number): Card[] {
  const pairsCount = level <= 2 ? 4 : level <= 4 ? 6 : 8;
  const selected = emojis.slice(0, pairsCount);
  const cards = [...selected, ...selected];
  
  return cards
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
}

export default function MemoryGame({ onBack }: MemoryGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initGame = useCallback(() => {
    setCards(generateCards(level));
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
  }, [level]);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      initGame();
    }
  }, [initialized, initGame]);

  const handleCardClick = (id: number) => {
    if (isLocked || cards[id].isFlipped || cards[id].isMatched) return;
    
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      
      const [first, second] = newFlipped;
      if (newCards[first].value === newCards[second].value) {
        setTimeout(() => {
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsLocked(false);
          setScore(s => s + 10 * level);
          
          if (newCards.every(c => c.isMatched)) {
            setTimeout(() => {
              const newLevel = level + 1;
              if (newLevel > 5) {
                setShowResult(true);
              } else {
                setLevel(newLevel);
                setCards(generateCards(newLevel));
                setFlippedCards([]);
                setIsLocked(false);
              }
            }, 1000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setShowResult(false);
    setCards(generateCards(1));
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
  };

  const cols = level <= 2 ? 4 : level <= 4 ? 4 : 4;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button onClick={onBack} className="p-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <Home className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-md">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-gray-800">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-md">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="font-bold text-gray-800">المستوى {level}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6 flex justify-between items-center">
          <span className="text-gray-600 font-semibold">الحركات: {moves}</span>
          <span className="text-gray-600 font-semibold">
            الأزواج المتبقية: {cards.filter(c => !c.isMatched).length / 2}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`level-${level}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              {/* Cards Grid */}
              <div 
                className="grid gap-3 mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  maxWidth: cols * 90
                }}
              >
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`aspect-square rounded-2xl text-4xl flex items-center justify-center shadow-md cursor-pointer transition-all ${
                      card.isMatched
                        ? 'bg-green-100 border-2 border-green-300'
                        : card.isFlipped
                        ? 'bg-white border-2 border-purple-300'
                        : 'bg-gradient-to-br from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600'
                    }`}
                    whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                    whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <motion.span
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {card.value}
                      </motion.span>
                    ) : (
                      <span className="text-white text-2xl font-bold">?</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block mb-4"
              >
                <Trophy className="w-20 h-20 text-amber-500" />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">مبروك!</h2>
              <p className="text-gray-600 mb-6">أكملت جميع المستويات بنجاح!</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-purple-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600">النقاط</p>
                  <p className="text-3xl font-black text-purple-500">{score}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600">إجمالي الحركات</p>
                  <p className="text-3xl font-black text-blue-500">{moves}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={restart} className="btn-secondary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  العب مرة أخرى
                </button>
                <button onClick={onBack} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  العودة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
