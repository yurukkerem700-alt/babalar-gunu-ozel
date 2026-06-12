import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Star, Calendar, Briefcase, Palette, Utensils,
  Music, Edit, Share2, Copy, Check, ExternalLink,
  Sparkles, Clock, Award, BookHeart, ArrowLeft
} from 'lucide-react';

const THEMES: Record<string, any> = {
  klasik: {
    bgGradient: 'linear-gradient(135deg, #0d1b4a 0%, #1a237e 50%, #0d1b4a 100%)',
    heroGradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%)',
    bgPrimary: '#0a1128',
    bgCard: 'rgba(26, 35, 126, 0.3)',
    bgCardBorder: 'rgba(255, 215, 0, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#b3c6ff',
    accent: '#ffd700',
    accentLight: '#fff3b0',
    accentDark: '#b8860b',
    cardHover: 'rgba(255, 215, 0, 0.1)',
    decorativeColor: 'rgba(255, 215, 0, 0.15)',
  },
  sicak: {
    bgGradient: 'linear-gradient(135deg, #4a0028 0%, #880e4f 50%, #4a0028 100%)',
    heroGradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #880e4f 100%)',
    bgPrimary: '#2d0018',
    bgCard: 'rgba(136, 14, 79, 0.3)',
    bgCardBorder: 'rgba(255, 171, 145, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#ffcdd2',
    accent: '#ffab91',
    accentLight: '#ffe0d6',
    accentDark: '#c75b3a',
    cardHover: 'rgba(255, 171, 145, 0.1)',
    decorativeColor: 'rgba(255, 171, 145, 0.15)',
  },
  doga: {
    bgGradient: 'linear-gradient(135deg, #0a3010 0%, #1b5e20 50%, #0a3010 100%)',
    heroGradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)',
    bgPrimary: '#071a08',
    bgCard: 'rgba(27, 94, 32, 0.3)',
    bgCardBorder: 'rgba(165, 214, 167, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#c8e6c9',
    accent: '#a5d6a7',
    accentLight: '#e8f5e9',
    accentDark: '#4caf50',
    cardHover: 'rgba(165, 214, 167, 0.1)',
    decorativeColor: 'rgba(165, 214, 167, 0.15)',
  },
  modern: {
    bgGradient: 'linear-gradient(135deg, #2a0050 0%, #4a148c 50%, #2a0050 100%)',
    heroGradient: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #4a148c 100%)',
    bgPrimary: '#1a0030',
    bgCard: 'rgba(74, 20, 140, 0.3)',
    bgCardBorder: 'rgba(206, 147, 216, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#e1bee7',
    accent: '#ce93d8',
    accentLight: '#f3e5f5',
    accentDark: '#9c27b0',
    cardHover: 'rgba(206, 147, 216, 0.1)',
    decorativeColor: 'rgba(206, 147, 216, 0.15)',
  },
  deniz: {
    bgGradient: 'linear-gradient(135deg, #062a5e 0%, #0d47a1 50%, #062a5e 100%)',
    heroGradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0d47a1 100%)',
    bgPrimary: '#041e42',
    bgCard: 'rgba(13, 71, 161, 0.3)',
    bgCardBorder: 'rgba(77, 208, 225, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#b3e5fc',
    accent: '#4dd0e1',
    accentLight: '#e0f7fa',
    accentDark: '#0097a7',
    cardHover: 'rgba(77, 208, 225, 0.1)',
    decorativeColor: 'rgba(77, 208, 225, 0.15)',
  },
};

const getZodiacSign = (dateStr: string): { sign: string; emoji: string } => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return { sign: 'Koç', emoji: '♈' };
  if ((month === 4 && day >= 21) || (month === 5 && day <= 21)) return { sign: 'Boğa', emoji: '♉' };
  if ((month === 5 && day >= 22) || (month === 6 && day <= 21)) return { sign: 'İkizler', emoji: '♊' };
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return { sign: 'Yengeç', emoji: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 23)) return { sign: 'Aslan', emoji: '♌' };
  if ((month === 8 && day >= 24) || (month === 9 && day <= 22)) return { sign: 'Başak', emoji: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return { sign: 'Terazi', emoji: '♎' };
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return { sign: 'Akrep', emoji: '♏' };
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return { sign: 'Yay', emoji: '♐' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return { sign: 'Oğlak', emoji: '♑' };
  if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return { sign: 'Kova', emoji: '♒' };
  return { sign: 'Balık', emoji: '♓' };
};

const calculateAge = (dateStr: string): number => {
  const today = new Date();
  const birth = new Date(dateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const daysSinceBirth = (dateStr: string): number => {
  const birth = new Date(dateStr);
  const today = new Date();
  return Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function FatherPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages?slug=${slug}`);
        if (!res.ok) throw new Error('Sayfa bulunamadı');
        const data = await res.json();
        setPage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    const text = `Babam ${page.father_name} için özel bir sayfa oluşturuldu! 💝 ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-200 text-lg font-serif">Sayfa hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😢</p>
          <p className="text-red-400 text-xl mb-4">{error || 'Sayfa bulunamadı'}</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-bold hover:bg-amber-400 transition">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const theme = THEMES[page.theme] || THEMES.klasik;
  const age = page.birth_date ? calculateAge(page.birth_date) : null;
  const days = page.birth_date ? daysSinceBirth(page.birth_date) : null;
  const zodiac = page.birth_date ? getZodiacSign(page.birth_date) : null;

  const hobbyIcons: Record<string, string> = {
    'Balık tutma': '🎣', 'Bahçecilik': '🌱', 'Satranç': '♟️', 'Futbol': '⚽',
    'Yürüyüş': '🚶', 'Kitap okuma': '📚', 'Marangozluk': '🔨', 'Fotoğrafçılık': '📷',
    'Yüzme': '🏊', 'Bisiklet': '🚴', 'Kamp': '⛺', 'Müzik': '🎵',
    'Yemek yapma': '👨‍🍳', 'Resim': '🎨', 'Dans': '💃', 'Seyahat': '✈️',
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bgGradient, color: theme.textPrimary }}>
      {/* Decorative floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: theme.decorativeColor,
              filter: 'blur(40px)',
            }}
            animate={{
              y: [0, Math.random() * 30 - 15, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <div className="relative z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition"
            style={{ color: theme.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowShare(!showShare)}
              className="p-2 rounded-full transition hover:scale-110"
              style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
            >
              <Share2 className="w-5 h-5" style={{ color: theme.accent }} />
            </button>
            <button
              onClick={() => navigate(`/baba/${slug}/edit`)}
              className="p-2 rounded-full transition hover:scale-110"
              style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
            >
              <Edit className="w-5 h-5" style={{ color: theme.accent }} />
            </button>
          </div>
        </div>

        {/* Share Dropdown */}
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-4 top-16 z-30 rounded-2xl p-4 shadow-2xl min-w-[280px]"
            style={{ background: theme.bgPrimary, border: `1px solid ${theme.bgCardBorder}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: theme.accent }}>Paylaş</p>
            <div className="space-y-2">
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl transition text-sm"
                style={{ background: theme.bgCard, color: theme.textPrimary }}
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </button>
              <button
                onClick={shareWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-green-600/20 text-green-300 hover:bg-green-600/30 transition text-sm"
              >
                <Share2 className="w-4 h-4" /> WhatsApp'ta Paylaş
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Father Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8"
          >
            {page.father_photo_url ? (
              <div className="photo-frame inline-block mx-auto" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight}, ${theme.accent})` }}>
                <img
                  src={page.father_photo_url}
                  alt={page.father_name}
                  className="w-48 h-48 md:w-56 md:h-56 object-cover"
                />
              </div>
            ) : (
              <div
                className="w-48 h-48 md:w-56 md:h-56 rounded-2xl mx-auto flex items-center justify-center text-7xl"
                style={{ background: theme.bgCard, border: `2px solid ${theme.accent}30` }}
              >
                👨
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="font-script text-2xl md:text-3xl mb-2" style={{ color: theme.accent }}>
              Canım Babam
            </p>
            <h1
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
              style={{ color: theme.textPrimary }}
            >
              {page.father_name}
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap" style={{ color: theme.textSecondary }}>
              {page.birth_date && (
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(page.birth_date)}
                </span>
              )}
              {age !== null && (
                <>
                  <span style={{ color: theme.accent }}>•</span>
                  <span className="text-sm">{age} yaşında</span>
                </>
              )}
              {zodiac && (
                <>
                  <span style={{ color: theme.accent }}>•</span>
                  <span className="text-sm">{zodiac.emoji} {zodiac.sign}</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Days counter */}
          {days !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 inline-block"
            >
              <div
                className="px-8 py-4 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <p className="font-serif text-3xl md:text-4xl font-bold" style={{ color: theme.accent }}>
                  {days.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                  gündür dünyamızı aydınlatıyorsun ☀️
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* QUALITIES SECTION */}
      {page.father_qualities && page.father_qualities.length > 0 && (
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Award className="w-10 h-10 mx-auto mb-3" style={{ color: theme.accent }} />
              <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: theme.accent }}>
                Babamı Özel Yapan Şeyler
              </h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4">
              {page.father_qualities.map((quality: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="px-6 py-3 rounded-2xl font-semibold text-lg"
                  style={{
                    background: theme.bgCard,
                    border: `1px solid ${theme.bgCardBorder}`,
                    color: theme.accent,
                  }}
                >
                  <Star className="w-4 h-4 inline mr-2" style={{ color: theme.accent }} />
                  {quality}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: theme.accent }}>
              Babam Hakkında
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.father_occupation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <Briefcase className="w-6 h-6 mb-2" style={{ color: theme.accent }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>Mesleği</p>
                <p className="font-semibold text-lg">{page.father_occupation}</p>
              </motion.div>
            )}
            {page.father_favorite_color && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <Palette className="w-6 h-6 mb-2" style={{ color: theme.accent }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>Favori Rengi</p>
                <p className="font-semibold text-lg">{page.father_favorite_color}</p>
              </motion.div>
            )}
            {page.father_favorite_food && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <Utensils className="w-6 h-6 mb-2" style={{ color: theme.accent }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>Favori Yemeği</p>
                <p className="font-semibold text-lg">{page.father_favorite_food}</p>
              </motion.div>
            )}
            {page.father_favorite_music && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <Music className="w-6 h-6 mb-2" style={{ color: theme.accent }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>Favori Müziği</p>
                <p className="font-semibold text-lg">{page.father_favorite_music}</p>
              </motion.div>
            )}
            {zodiac && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <span className="text-2xl mb-2 block">{zodiac.emoji}</span>
                <p className="text-sm" style={{ color: theme.textSecondary }}>Burcu</p>
                <p className="font-semibold text-lg">{zodiac.sign}</p>
              </motion.div>
            )}
            {age !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="p-5 rounded-2xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <Clock className="w-6 h-6 mb-2" style={{ color: theme.accent }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>Yaşı</p>
                <p className="font-semibold text-lg">{age} yaşında</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* HOBBIES SECTION */}
      {((page.father_hobbies && page.father_hobbies.length > 0) || (page.father_interests && page.father_interests.length > 0)) && (
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: theme.accent }} />
              <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: theme.accent }}>
                Sevdiği Şeyler
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {page.father_hobbies && page.father_hobbies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl"
                  style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
                >
                  <h3 className="font-semibold text-xl mb-4" style={{ color: theme.accentLight }}>
                    🎯 Hobileri
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {page.father_hobbies.map((hobby: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ background: `${theme.accent}20`, color: theme.accentLight }}
                      >
                        {hobbyIcons[hobby] || '⭐'} {hobby}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {page.father_interests && page.father_interests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl"
                  style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
                >
                  <h3 className="font-semibold text-xl mb-4" style={{ color: theme.accentLight }}>
                    💡 İlgi Alanları
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {page.father_interests.map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ background: `${theme.accent}20`, color: theme.accentLight }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PHOTOS SECTION */}
      {(page.father_photo_url || page.family_photo_url) && (
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: theme.accent }} />
              <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: theme.accent }}>
                Özel Anlar
              </h2>
            </motion.div>
            <div className={`grid gap-8 ${page.father_photo_url && page.family_photo_url ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
              {page.father_photo_url && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="photo-frame inline-block" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight}, ${theme.accent})` }}>
                    <img
                      src={page.father_photo_url}
                      alt={page.father_name}
                      className="w-full h-72 md:h-80 object-cover"
                    />
                  </div>
                  <p className="font-script text-xl mt-4" style={{ color: theme.accent }}>
                    {page.father_name}
                  </p>
                </motion.div>
              )}
              {page.family_photo_url && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="photo-frame inline-block" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight}, ${theme.accent})` }}>
                    <img
                      src={page.family_photo_url}
                      alt="Birlikte"
                      className="w-full h-72 md:h-80 object-cover"
                    />
                  </div>
                  <p className="font-script text-xl mt-4" style={{ color: theme.accent }}>
                    Birlikte 💕
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAVORITE MEMORY */}
      {page.favorite_memory && (
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-3xl text-center"
              style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
            >
              <BookHeart className="w-10 h-10 mx-auto mb-4" style={{ color: theme.accent }} />
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6" style={{ color: theme.accent }}>
                En Güzel Anımız
              </h2>
              <p className="text-lg md:text-xl leading-relaxed italic" style={{ color: theme.textSecondary }}>
                "{page.favorite_memory}"
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* STORY */}
      {page.story && (
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: theme.accent }}>
                Babam Hakkında
              </h2>
              <div
                className="p-8 rounded-3xl"
                style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
              >
                <p className="text-lg leading-relaxed" style={{ color: theme.textSecondary }}>
                  {page.story}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* MESSAGE SECTION - Most important */}
      {page.message && (
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative corners */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 rounded-tl-3xl" style={{ borderColor: theme.accent }} />
              <div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 rounded-tr-3xl" style={{ borderColor: theme.accent }} />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 rounded-bl-3xl" style={{ borderColor: theme.accent }} />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 rounded-br-3xl" style={{ borderColor: theme.accent }} />

              <div className="p-10 md:p-16 text-center rounded-2xl" style={{ background: `${theme.bgCard}`, border: `1px solid ${theme.bgCardBorder}` }}>
                <Heart className="w-12 h-12 mx-auto mb-6 fill-current" style={{ color: theme.accent }} />
                <h2 className="font-script text-3xl md:text-4xl mb-8" style={{ color: theme.accent }}>
                  Sana Özel Mesajım
                </h2>
                <p className="font-serif text-xl md:text-2xl leading-relaxed" style={{ color: theme.textPrimary }}>
                  {page.message}
                </p>
                <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${theme.bgCardBorder}` }}>
                  <p className="font-script text-2xl" style={{ color: theme.accent }}>
                    Sevgiyle,
                  </p>
                  <p className="font-serif text-xl font-bold mt-1" style={{ color: theme.textPrimary }}>
                    {page.creator_name}
                    {page.creator_relationship && (
                      <span className="font-normal text-base ml-2" style={{ color: theme.textSecondary }}>
                        ({page.creator_relationship})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="p-8 rounded-3xl"
            style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}
          >
            <p className="text-lg mb-4" style={{ color: theme.textSecondary }}>
              ✨ Siz de babanız için özel bir sayfa oluşturun
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-xl font-bold text-lg transition hover:scale-105"
              style={{ background: theme.accent, color: theme.bgPrimary }}
            >
              Babam İçin Sayfa Oluştur 💝
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center" style={{ borderTop: `1px solid ${theme.bgCardBorder}` }}>
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          Bu sayfa <span className="font-semibold" style={{ color: theme.accent }}>{page.creator_name}</span> tarafından
          {' '}{page.creator_relationship ? `${page.creator_relationship} olarak ` : ''}
          sevgiyle oluşturuldu 💝
        </p>
        <p className="text-xs mt-2 opacity-50" style={{ color: theme.textSecondary }}>
          Babalar Günü Özel
        </p>
      </footer>
    </div>
  );
}
