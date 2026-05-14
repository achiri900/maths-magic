import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Trophy, Star, Home, CheckCircle, XCircle } from 'lucide-react';

interface MathGameProps {
  onBack: () => void;
}

type Operation = 'add' | 'subtract';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

function generateQuestion(level: number): Question {
  const maxNum = level <= 2 ? 10 : level <= 4 ? 20 : 50;
  const operation: Operation = Math.random() > 0.5 ? 'add' : 'subtract';
  let num1 = Math.floor(Math.random() * maxNum) + 1;
  let num2 = Math.floor(Math.random() * maxNum) + 1;
  
  if (operation === 'subtract' && num1 < num2) {
    [num1, num2] = [num2, num1];
  }
  
  const answer = operation === 'add' ? num1 + num2 : num1 - num2;
  
  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + offset;
    if (wrong >= 0 && wrong !== answer) {
      options.add(wrong);
    }
  }
  
  return {
    num1,
    num2,
    operation,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
}

export default function MathGame({ onBack }: MathGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question>(generateQuestion(1));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const nextQuestion = useCallback(() => {
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    
    if (newCount >= 10) {
      setShowResult(true);
      return;
    }
    
    const newLevel = Math.min(Math.floor(newCount / 2) + 1, 5);
    setLevel(newLevel);
    setQuestion(generateQuestion(newLevel));
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [questionCount]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 10 * level);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 1200);
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setQuestionCount(0);
    setQuestion(generateQuestion(1));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    setStreak(0);
    setBestStreak(0);
  };

  const operationSymbol = question.operation === 'add' ? '+' : '-';

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
              <Star className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-gray-800">المستوى {level}</span>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>السؤال {questionCount + 1} من 10</span>
            <span>أفضل سلسلة: {bestStreak}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
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
                <div className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-black text-gray-800 mb-8">
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={question.num1}
                    className="bg-pink-50 px-6 py-4 rounded-2xl"
                  >
                    {question.num1}
                  </motion.span>
                  <span className="text-pink-500">{operationSymbol}</span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={question.num2}
                    className="bg-pink-50 px-6 py-4 rounded-2xl"
                  >
                    {question.num2}
                  </motion.span>
                  <span className="text-gray-400">=</span>
                  <span className="text-gray-300">؟</span>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={`${option}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                        selectedAnswer === null
                          ? 'bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-gray-800 shadow-md hover:shadow-lg cursor-pointer'
                          : selectedAnswer === option
                          ? isCorrect
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
                            : 'bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-lg'
                          : option === question.answer && !isCorrect
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {selectedAnswer === option && (
                          isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                        )}
                        {option}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isCorrect ? 'أحسنت! إجابة صحيحة' : 'للأسف! حاول مرة أخرى'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Streak */}
              {streak > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold">
                    <Zap className="w-5 h-5" />
                    سلسلة صحيحة: {streak}
                  </span>
                </motion.div>
              )}
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
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-pink-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600">النقاط</p>
                  <p className="text-3xl font-black text-pink-500">{score}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600">أفضل سلسلة</p>
                  <p className="text-3xl font-black text-amber-500">{bestStreak}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={restart} className="btn-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
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

function Zap(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
