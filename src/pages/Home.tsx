import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift, ArrowDown, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import CreateForm from '../components/CreateForm';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [createdPage, setCreatedPage] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      // Fotoğraf varsa boyut kontrolü
      if (formData.fatherPhotoBase64) {
        const sizeKB = Math.round(formData.fatherPhotoBase64.length / 1024);
        console.log('Father photo size:', sizeKB, 'KB');
        if (sizeKB > 2000) {
          throw new Error('Baba fotoğrafı çok büyük (2MB\'dan küçük olmalı). Lütfen daha küçük bir fotoğraf seçin.');
        }
      }
      if (formData.familyPhotoBase64) {
        const sizeKB = Math.round(formData.familyPhotoBase64.length / 1024);
        console.log('Family photo size:', sizeKB, 'KB');
        if (sizeKB > 2000) {
          throw new Error('Aile fotoğrafı çok büyük (2MB\'dan küçük olmalı). Lütfen daha küçük bir fotoğraf seçin.');
        }
      }

      console.log('Sending request to API...');
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Bilinmeyen hata' }));
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Sayfa oluşturulurken bir hata oluştu');
      }

      const data = await res.json();
      console.log('Page created successfully:', data);
      
      // Form modal'ı kapat ve success modal'ı göster
      setShowForm(false);
      setCreatedPage(data);
    } catch (err: any) {
      console.error('Submit error:', err);
      alert('❌ Hata: ' + err.message + '\n\nLütfen tekrar deneyin veya fotoğraf yüklemeden tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/baba/${createdPage.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    const link = `${window.location.origin}/baba/${createdPage.slug}`;
    const text = `Babam ${createdPage.father_name} için özel bir sayfa oluşturdum! 💝 ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amber-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['♥', '★', '✦'][Math.floor(Math.random() * 3)]}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-200 text-sm font-semibold tracking-wide">BABALAR GÜNÜ ÖZEL</span>
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
          </motion.div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Babana Özel
            </span>
            <br />
            <span className="text-white">
              Bir Sayfa Oluştur
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto mb-4 leading-relaxed">
            Babanın adını, sevdiği şeyleri, birlikte geçirdiğiniz güzel anları gir.
            Biz de ona özel, duygusal ve unutulmaz bir web sayfası oluşturalım.
          </p>
          <p className="text-base text-amber-300/70 mb-10">
            Oluşturduğun linki babanla paylaş — bu Babalar Günü'nde onu çok mutlu et! 💝
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="group relative px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Hemen Başla
                <Gift className="w-5 h-5" />
              </span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <ArrowDown className="w-6 h-6 text-amber-400/50 mx-auto animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 mt-8 max-w-3xl mx-auto w-full px-4"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
            <img
              src="/hero-father.jpg"
              alt="Baba ve çocuk"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-script text-2xl md:text-3xl text-amber-200">
                "Babam, hayatımdaki en güzel hikaye..."
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-center text-amber-300 mb-16"
          >
            Nasıl Çalışır?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Bilgileri Gir',
                desc: 'Babanın adını, doğum tarihini, sevdiği şeyleri, hobilerini ve ona söylemek istediklerini yaz.',
              },
              {
                icon: '🎨',
                title: 'Temanı Seç',
                desc: 'Klasik, sıcak, doğa, modern veya deniz temalarından babana en uygun olanı seç.',
              },
              {
                icon: '💝',
                title: 'Paylaş & Mutlu Et',
                desc: 'Oluşturduğun özel linki babanla paylaş. Babalar Günü\'nde onu gözyaşlarına boğ!',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:border-amber-500/30"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-amber-200 mb-3">{item.title}</h3>
                <p className="text-blue-200/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-3xl p-10 md:p-16 text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-200 mb-4">
            Baban Her Şeyin En Güzelini Hak Ediyor
          </h2>
          <p className="text-blue-200/80 text-lg mb-8">
            Ona bu Babalar Günü'nde unutulmaz bir hediye ver. Sadece birkaç dakikada ona özel bir sayfa oluştur.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Babam İçin Sayfa Oluştur 💝
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-blue-300/40 text-sm border-t border-white/5">
        <p>Babalar Günü Özel 💝 Sevgiyle oluşturuldu</p>
      </footer>

      {/* Create Form Modal */}
      {showForm && !createdPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full py-8 px-4 flex items-start justify-center">
            <div className="w-full max-w-3xl">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/60 hover:text-white text-2xl font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  ✕
                </button>
              </div>
              <CreateForm
                onSubmit={handleSubmit}
                isEditing={false}
                saving={submitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {createdPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-blue-900 border border-amber-500/30 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-serif text-3xl font-bold text-amber-300 mb-3">
              Sayfa Oluşturuldu!
            </h2>
            <p className="text-blue-200 mb-6">
              <span className="font-semibold text-amber-200">{createdPage.father_name}</span> için özel sayfa hazır!
            </p>

            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-300 mb-2">Sayfa Linkin:</p>
              <p className="text-amber-200 text-sm break-all font-mono">
                {window.location.origin}/baba/{createdPage.slug}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition"
              >
                <Share2 className="w-5 h-5" />
                WhatsApp'ta Paylaş
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`/baba/${createdPage.slug}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition border border-white/20"
              >
                <ExternalLink className="w-5 h-5" />
                Sayfayı Gör
              </a>
              <button
                onClick={() => {
                  setCreatedPage(null);
                  setShowForm(false);
                }}
                className="flex-1 px-6 py-3 bg-white/5 text-blue-200 font-semibold rounded-xl hover:bg-white/10 transition border border-white/10"
              >
                Yeni Sayfa Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
