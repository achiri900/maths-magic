import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Trophy, Star, Home, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';

interface GuessNumberProps {
  onBack: () => void;
}

export default function GuessNumber({ onBack }: GuessNumberProps) {
  const [level, setLevel] = useState(1);
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 50) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [history, setHistory] = useState<{ guess: number; hint: string }[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const getMaxNum = (lvl: number) => {
    if (lvl <= 2) return 50;
    if (lvl <= 4) return 100;
    return 200;
  };

  const getMaxAttempts = (lvl: number) => {
    if (lvl <= 2) return 7;
    if (lvl <= 4) return 8;
    return 10;
  };

  const startNewLevel = useCallback((lvl: number) => {
    const maxNum = getMaxNum(lvl);
    setTargetNumber(Math.floor(Math.random() * maxNum) + 1);
    setGuess('');
    setAttempts(0);
    setMaxAttempts(getMaxAttempts(lvl));
    setHistory([]);
    setGameState('playing');
    setScore(0);
  }, []);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > getMaxNum(level)) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let hint = '';
    if (num === targetNumber) {
      hint = 'صحيح!';
      setGameState('won');
      const levelScore = Math.max((maxAttempts - newAttempts + 1) * 10 * level, 10);
      setScore(levelScore);
      setTotalScore(s => s + levelScore);
    } else if (num < targetNumber) {
      hint = 'أكبر!';
    } else {
      hint = 'أصغر!';
    }
    
    setHistory(prev => [...prev, { guess: num, hint }]);
    setGuess('');
    
    if (newAttempts >= maxAttempts && num !== targetNumber) {
      setGameState('lost');
    }
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    if (newLevel > 5) {
      // Game completed
    } else {
      setLevel(newLevel);
      startNewLevel(newLevel);
    }
  };

  const restart = () => {
    setLevel(1);
    setTotalScore(0);
    startNewLevel(1);
  };

  const maxNum = getMaxNum(level);

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
              <span className="font-bold text-gray-800">{totalScore}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-md">
              <Star className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-gray-800">المستوى {level}</span>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>المحاولات: {attempts} من {maxAttempts}</span>
            <span>الرقم بين 1 و {maxNum}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(attempts / maxAttempts) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              {/* Input Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  خمن الرقم السري!
                </h3>
                <p className="text-gray-600 mb-6">
                  الرقم بين 1 و {maxNum}. لديك {maxAttempts} محاولات.
                </p>

                <div className="flex gap-3 justify-center mb-6">
                  <input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder="؟"
                    min={1}
                    max={maxNum}
                    className="w-32 h-20 text-4xl text-center font-bold rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none bg-emerald-50 text-gray-800"
                  />
                  <button
                    onClick={handleGuess}
                    disabled={!guess}
                    className="btn-success text-white px-8 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    خمن
                  </button>
                </div>

                {/* History */}
                {history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <p className="text-sm text-gray-500 mb-3">محاولاتك السابقة</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {history.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
                            item.hint === 'صحيح!'
                              ? 'bg-green-100 text-green-700'
                              : item.hint === 'أكبر!'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.hint === 'أكبر!' ? <ArrowUp className="w-4 h-4" /> : 
                           item.hint === 'أصغر!' ? <ArrowDown className="w-4 h-4" /> : 
                           <CheckCircle className="w-4 h-4" />}
                          {item.guess} - {item.hint}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              {gameState === 'won' ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="inline-block mb-4"
                  >
                    <Trophy className="w-20 h-20 text-amber-500" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">أحسنت!</h2>
                  <p className="text-gray-600 mb-2">لقد وجدت الرقم السري: {targetNumber}</p>
                  <p className="text-emerald-600 font-bold mb-6">نقاط هذا المستوى: {score}</p>
                  
                  {level < 5 ? (
                    <button
                      onClick={nextLevel}
                      className="btn-success text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto"
                    >
                      <ArrowRight className="w-5 h-5" />
                      المستوى التالي
                    </button>
                  ) : (
                    <div>
                      <p className="text-xl font-bold text-gray-800 mb-4">
                        مبروك! أكملت جميع المستويات!
                      </p>
                      <p className="text-2xl font-black text-emerald-500 mb-6">
                        النقاط الإجمالية: {totalScore}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button onClick={restart} className="btn-success text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
                          <RotateCcw className="w-5 h-5" />
                          العب مرة أخرى
                        </button>
                        <button onClick={onBack} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                          <ArrowRight className="w-5 h-5" />
                          العودة
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mb-4"
                  >
                    <Star className="w-20 h-20 text-gray-400" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">انتهت المحاولات!</h2>
                  <p className="text-gray-600 mb-2">الرقم السري كان: {targetNumber}</p>
                  <p className="text-gray-500 mb-6">لا تستسلم! حاول مرة أخرى</p>
                  
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => startNewLevel(level)} className="btn-success text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      أعد المحاولة
                    </button>
                    <button onClick={onBack} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      العودة
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
