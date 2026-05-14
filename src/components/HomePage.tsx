import { motion } from 'framer-motion';
import { Calculator, Brain, Shuffle, Eye, Search, Puzzle, Trophy, Star, Zap, Heart } from 'lucide-react';

interface HomePageProps {
  onSelectGame: (game: string) => void;
}

const games = [
  {
    id: 'math',
    title: 'جمع وطرح',
    description: 'اختبر مهاراتك في الجمع والطرح مع أسئلة ممتعة!',
    icon: Calculator,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    difficulty: 'سهل',
    stars: 3,
  },
  {
    id: 'multiply',
    title: 'جدول الضرب',
    description: 'تعلم جدول الضرب بطريقة ممتعة وتفاعلية!',
    icon: Zap,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    difficulty: 'متوسط',
    stars: 4,
  },
  {
    id: 'order',
    title: 'ترتيب الأرقام',
    description: 'رتب الأرقام من الأصغر إلى الأكبر بسرعة!',
    icon: Shuffle,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    difficulty: 'سهل',
    stars: 3,
  },
  {
    id: 'memory',
    title: 'لعبة الذاكرة',
    description: 'اختبر ذاكرتك واعثر على الأزواج المتطابقة!',
    icon: Eye,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    difficulty: 'متوسط',
    stars: 4,
  },
  {
    id: 'guess',
    title: 'خمن الرقم',
    description: 'حاول تخمين الرقم السري بأقل عدد من المحاولات!',
    icon: Search,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    difficulty: 'صعب',
    stars: 5,
  },
  {
    id: 'pattern',
    title: 'أنماط الأرقام',
    description: 'اكتشف النمط و أكمل السلسلة الرياضية!',
    icon: Puzzle,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    difficulty: 'متوسط',
    stars: 4,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
};

export default function HomePage({ onSelectGame }: HomePageProps) {
  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 px-4"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Brain className="w-20 h-20 text-pink-500" />
          </motion.div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
          عالم <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">الألعاب الرياضية</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          منصة تفاعلية ممتعة لتعلم الرياضيات وحل الألغاز وتنمية العقل للمستوى الابتدائي
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">6 ألعاب</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">مستويات متعددة</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="font-semibold">مجانية 100%</span>
          </div>
        </div>
      </motion.header>

      {/* Games Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              variants={itemVariants}
              onClick={() => onSelectGame(game.id)}
              className={`game-card ${game.bgColor} rounded-3xl p-6 text-right w-full border-2 border-transparent hover:border-${game.iconColor.split('-')[1]}-200 cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${game.color} shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  game.difficulty === 'سهل' ? 'bg-green-100 text-green-700' :
                  game.difficulty === 'متوسط' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{game.description}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < game.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mt-16 px-4"
      >
        <div className="glass-card rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">لماذا الألعاب الرياضية؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تنمية العقل</h3>
              <p className="text-gray-600 text-sm">تساعد الألعاب الرياضية على تنمية التفكير المنطقي والتحليلي</p>
            </div>
            <div className="p-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">سرعة البديهة</h3>
              <p className="text-gray-600 text-sm">تطور القدرة على الحساب السريع واتخاذ القرارات</p>
            </div>
            <div className="p-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تعلم ممتع</h3>
              <p className="text-gray-600 text-sm">تجعل عملية التعلم ممتعة ومحفزة للأطفال</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
