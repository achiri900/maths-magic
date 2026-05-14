import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Trophy, Home, CheckCircle, XCircle, Puzzle } from 'lucide-react';

interface PatternGameProps {
  onBack: () => void;
}

interface Question {
  sequence: number[];
  answer: number;
  options: number[];
  pattern: string;
}

function generateQuestion(level: number): Question {
  const patterns = [
    // Add 2
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const seq = [start, start + 2, start + 4, start + 6];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'أضف 2' };
    },
    // Add 3
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const seq = [start, start + 3, start + 6, start + 9];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'أضف 3' };
    },
    // Add 5
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const seq = [start, start + 5, start + 10, start + 15];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'أضف 5' };
    },
    // Multiply by 2
    () => {
      const start = Math.floor(Math.random() * 5) + 1;
      const seq = [start, start * 2, start * 4, start * 8];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'اضرب في 2' };
    },
    // Subtract 2
    () => {
      const start = Math.floor(Math.random() * 10) + 15;
      const seq = [start, start - 2, start - 4, start - 6];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'اطرح 2' };
    },
    // Add then subtract
    () => {
      const start = Math.floor(Math.random() * 10) + 5;
      const seq = [start, start + 3, start + 1, start + 4];
      return { sequence: seq.slice(0, 3), answer: seq[3], pattern: 'أضف 3 ثم اطرح 2' };
    },
  ];

  const availablePatterns = patterns.slice(0, Math.min(level + 1, patterns.length));
  const selected = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
  const { sequence, answer, pattern } = selected();

  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + offset;
    if (wrong > 0 && wrong !== answer) {
      options.add(wrong);
    }
  }

  return {
    sequence,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    pattern,
  };
}

export default function PatternGame({ onBack }: PatternGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question>(generateQuestion(1));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
    setShowHint(false);
  }, [questionCount]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 10 * level + (showHint ? 0 : 5));
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setQuestionCount(0);
    setQuestion(generateQuestion(1));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    setShowHint(false);
  };

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
              <Puzzle className="w-5 h-5 text-red-500" />
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
              className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  أكمل النمط الرياضي
                </h3>
                <p className="text-gray-600 mb-6">ما هو الرقم التالي في السلسلة؟</p>

                {/* Sequence */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  {question.sequence.map((num, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center text-2xl md:text-3xl font-black text-gray-800 shadow-md"
                    >
                      {num}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center text-3xl font-black text-red-300 shadow-md border-2 border-dashed border-red-300"
                  >
                    ؟
                  </motion.div>
                </div>

                {/* Hint */}
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold mb-4 underline"
                  >
                    أحتاج تلميحاً (-5 نقاط)
                  </button>
                )}
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 font-bold mb-4 bg-red-50 px-4 py-2 rounded-xl inline-block"
                  >
                    التلميح: {question.pattern}
                  </motion.p>
                )}

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
                          ? 'bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-gray-800 shadow-md hover:shadow-lg cursor-pointer'
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
                      {isCorrect ? 'أحسنت! النمط صحيح' : 'للأسف! حاول مرة أخرى'}
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
              
              <div className="bg-red-50 rounded-2xl p-6 mb-8">
                <p className="text-sm text-gray-600">النقاط</p>
                <p className="text-5xl font-black text-red-500">{score}</p>
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
