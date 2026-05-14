import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Trophy, Star, Home, ArrowUp, ArrowDown } from 'lucide-react';

interface OrderGameProps {
  onBack: () => void;
}

export default function OrderGame({ onBack }: OrderGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [sortedNumbers, setSortedNumbers] = useState<number[]>([]);
  const [targetOrder, setTargetOrder] = useState<'asc' | 'desc'>('asc');
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = useCallback((currentLevel: number) => {
    const count = currentLevel <= 2 ? 4 : currentLevel <= 4 ? 5 : 6;
    const maxNum = currentLevel <= 2 ? 20 : currentLevel <= 4 ? 50 : 100;
    const nums = new Set<number>();
    while (nums.size < count) {
      nums.add(Math.floor(Math.random() * maxNum) + 1);
    }
    const numsArray = Array.from(nums);
    setNumbers(numsArray);
    setSortedNumbers([]);
    setTargetOrder(Math.random() > 0.5 ? 'asc' : 'desc');
    setFeedback(null);
    setIsCorrect(null);
  }, []);

  const handleNumberClick = (num: number) => {
    if (isCorrect !== null) return;
    
    const newSorted = [...sortedNumbers, num];
    setSortedNumbers(newSorted);
    setNumbers(numbers.filter(n => n !== num));
    
    if (newSorted.length === numbers.length + 1) {
      const correct = targetOrder === 'asc' 
        ? [...newSorted].every((v, i, a) => !i || a[i-1] <= v)
        : [...newSorted].every((v, i, a) => !i || a[i-1] >= v);
      
      setIsCorrect(correct);
      if (correct) {
        setScore(s => s + 10 * level);
        setFeedback('أحسنت! ترتيب صحيح');
      } else {
        setFeedback('للأسف! الترتيب غير صحيح');
      }
      
      setTimeout(() => {
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
        if (newCount >= 10) {
          setShowResult(true);
        } else {
          const newLevel = Math.min(Math.floor(newCount / 2) + 1, 5);
          setLevel(newLevel);
          generateQuestion(newLevel);
        }
      }, 1500);
    }
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setQuestionCount(0);
    setShowResult(false);
    setSortedNumbers([]);
    generateQuestion(1);
  };

  // Initialize on mount
  useEffect(() => {
    generateQuestion(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Star className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-gray-800">المستوى {level}</span>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>السؤال {questionCount + 1} من 10</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionCount / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              {/* Question Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    رتب الأرقام من {targetOrder === 'asc' ? 'الأصغر إلى الأكبر' : 'الأكبر إلى الأصغر'}
                  </h3>
                  <div className="flex justify-center">
                    {targetOrder === 'asc' ? (
                      <ArrowUp className="w-8 h-8 text-amber-500" />
                    ) : (
                      <ArrowDown className="w-8 h-8 text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Numbers to sort */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-3">اضغط على الأرقام بالترتيب الصحيح</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {numbers.map((num, index) => (
                      <motion.button
                        key={`${num}-${index}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNumberClick(num)}
                        disabled={isCorrect !== null}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-2xl font-bold text-gray-800 shadow-md hover:shadow-lg cursor-pointer transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sorted numbers */}
                {sortedNumbers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t-2 border-dashed border-gray-200 pt-6"
                  >
                    <p className="text-sm text-gray-500 mb-3">ترتيبك</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {sortedNumbers.map((num, index) => (
                        <motion.div
                          key={`sorted-${num}-${index}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl font-bold shadow-lg flex items-center justify-center"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {feedback}
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <h2 className="text-3xl font-black text-gray-800 mb-2">انتهت اللعبة!</h2>
              <p className="text-gray-600 mb-6">أداء رائع! إليك نتيجتك النهائية</p>
              
              <div className="bg-amber-50 rounded-2xl p-6 mb-8">
                <p className="text-sm text-gray-600">النقاط</p>
                <p className="text-5xl font-black text-amber-500">{score}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={restart} className="btn-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
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
