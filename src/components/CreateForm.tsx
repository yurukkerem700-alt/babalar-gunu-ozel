import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Camera, Heart, Star, Briefcase,
  Palette, Utensils, Music, Sparkles, User, Users,
  MessageCircle, BookHeart, Plus, X, Check, Loader2
} from 'lucide-react';

const THEMES = [
  {
    id: 'klasik',
    name: 'Klasik & Zarif',
    desc: 'Lacivert ve altın tonları — ağırbaşlı ve asil',
    colors: ['#1a237e', '#ffd700', '#0d1b4a'],
    emoji: '👑',
  },
  {
    id: 'sicak',
    name: 'Sıcak & Samimi',
    desc: 'Bordo ve krem tonları — sıcak ve sevgi dolu',
    colors: ['#880e4f', '#ffab91', '#4a0028'],
    emoji: '🔥',
  },
  {
    id: 'doga',
    name: 'Doğa & Huzur',
    desc: 'Yeşil ve toprak tonları — doğal ve huzurlu',
    colors: ['#1b5e20', '#a5d6a7', '#0a3010'],
    emoji: '🌿',
  },
  {
    id: 'modern',
    name: 'Modern & Şık',
    desc: 'Mor ve beyaz tonları — şık ve çağdaş',
    colors: ['#4a148c', '#ce93d8', '#2a0050'],
    emoji: '✨',
  },
  {
    id: 'deniz',
    name: 'Deniz & Ferah',
    desc: 'Lacivert ve turkuaz — ferah ve sakin',
    colors: ['#0d47a1', '#4dd0e1', '#062a5e'],
    emoji: '🌊',
  },
];

const compressImage = (file: File, maxWidth = 600, quality = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        console.log('Compressed image size:', Math.round(base64.length / 1024), 'KB');
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface FormData {
  father_name: string;
  birth_date: string;
  father_occupation: string;
  father_favorite_color: string;
  father_favorite_food: string;
  father_favorite_music: string;
  father_hobbies: string[];
  father_interests: string[];
  father_qualities: string[];
  message: string;
  story: string;
  creator_name: string;
  creator_relationship: string;
  favorite_memory: string;
  theme: string;
  fatherPhotoBase64?: string | null;
  familyPhotoBase64?: string | null;
  father_photo_url?: string | null;
  family_photo_url?: string | null;
}

interface Props {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  isEditing: boolean;
  saving: boolean;
}

export default function CreateForm({ initialData, onSubmit, isEditing, saving }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    father_name: initialData?.father_name || '',
    birth_date: initialData?.birth_date || '',
    father_occupation: initialData?.father_occupation || '',
    father_favorite_color: initialData?.father_favorite_color || '',
    father_favorite_food: initialData?.father_favorite_food || '',
    father_favorite_music: initialData?.father_favorite_music || '',
    father_hobbies: initialData?.father_hobbies || [],
    father_interests: initialData?.father_interests || [],
    father_qualities: initialData?.father_qualities || [],
    message: initialData?.message || '',
    story: initialData?.story || '',
    creator_name: initialData?.creator_name || '',
    creator_relationship: initialData?.creator_relationship || '',
    favorite_memory: initialData?.favorite_memory || '',
    theme: initialData?.theme || 'klasik',
    father_photo_url: initialData?.father_photo_url || null,
    family_photo_url: initialData?.family_photo_url || null,
  });

  const [hobbyInput, setHobbyInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [qualityInput, setQualityInput] = useState('');
  const [photoFiles, setPhotoFiles] = useState<{ father: File | null; family: File | null }>({ father: null, family: null });
  const [photoPreviews, setPhotoPreviews] = useState<{ father: string | null; family: string | null }>({
    father: initialData?.father_photo_url || null,
    family: initialData?.family_photo_url || null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fatherPhotoRef = useRef<HTMLInputElement>(null);
  const familyPhotoRef = useRef<HTMLInputElement>(null);

  const steps = [
    { title: 'Babanı Tanıtalım', icon: <User className="w-5 h-5" /> },
    { title: 'Sevdiği Şeyler', icon: <Heart className="w-5 h-5" /> },
    { title: 'Kişiliği', icon: <Star className="w-5 h-5" /> },
    { title: 'Fotoğraflar', icon: <Camera className="w-5 h-5" /> },
    { title: 'Sen ve Baban', icon: <Users className="w-5 h-5" /> },
    { title: 'Mesajın', icon: <MessageCircle className="w-5 h-5" /> },
    { title: 'Tema Seçimi', icon: <Palette className="w-5 h-5" /> },
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const addTag = (field: 'father_hobbies' | 'father_interests' | 'father_qualities', value: string, setter: Function) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      updateField(field, [...formData[field], value.trim()]);
      setter('');
    }
  };

  const removeTag = (field: 'father_hobbies' | 'father_interests' | 'father_qualities', index: number) => {
    updateField(field, formData[field].filter((_, i) => i !== index));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'father' | 'family') => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFiles(prev => ({ ...prev, [type]: file }));
      setPhotoPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.father_name.trim()) newErrors.father_name = 'Babanın adı gerekli';
      if (!formData.birth_date) newErrors.birth_date = 'Doğum tarihi gerekli';
    }
    if (step === 4) {
      if (!formData.creator_name.trim()) newErrors.creator_name = 'Adın gerekli';
    }
    if (step === 5) {
      if (!formData.message.trim()) newErrors.message = 'Baban için bir mesaj yaz';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      let submitData = { ...formData };

      if (photoFiles.father) {
        submitData.fatherPhotoBase64 = await compressImage(photoFiles.father);
      }
      if (photoFiles.family) {
        submitData.familyPhotoBase64 = await compressImage(photoFiles.family);
      }

      delete (submitData as any).father_photo_url;
      delete (submitData as any).family_photo_url;

      onSubmit(submitData);
    } catch (err: any) {
      console.error('Form submit error:', err);
      alert('Bir hata oluştu: ' + err.message);
    }
  };

  const renderTagInput = (
    field: 'father_hobbies' | 'father_interests' | 'father_qualities',
    value: string,
    setter: Function,
    placeholder: string,
    suggestions: string[]
  ) => (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={value}
          onChange={e => setter(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(field, value, setter); } }}
          placeholder={placeholder}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition"
        />
        <button
          type="button"
          onClick={() => addTag(field, value, setter)}
          className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 hover:bg-amber-500/30 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {formData[field].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 text-amber-200 text-sm">
            {item}
            <button onClick={() => removeTag(field, i)} className="hover:text-red-400 transition">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.filter(s => !formData[field].includes(s)).slice(0, 6).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => addTag(field, s, setter)}
            className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/50 hover:bg-white/10 hover:text-white/80 transition"
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Babanın Adı Soyadı *
              </label>
              <input
                type="text"
                value={formData.father_name}
                onChange={e => updateField('father_name', e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className={`w-full bg-white/10 border ${errors.father_name ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition text-lg`}
              />
              {errors.father_name && <p className="text-red-400 text-sm mt-1">{errors.father_name}</p>}
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                📅 Doğum Tarihi *
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={e => updateField('birth_date', e.target.value)}
                className={`w-full bg-white/10 border ${errors.birth_date ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition`}
              />
              {errors.birth_date && <p className="text-red-400 text-sm mt-1">{errors.birth_date}</p>}
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Mesleği
              </label>
              <input
                type="text"
                value={formData.father_occupation}
                onChange={e => updateField('father_occupation', e.target.value)}
                placeholder="Örn: Öğretmen, Mühendis, Emekli..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Hobileri
              </label>
              {renderTagInput('father_hobbies', hobbyInput, setHobbyInput, 'Hobi ekle...', ['Balık tutma', 'Bahçecilik', 'Satranç', 'Futbol', 'Yürüyüş', 'Kitap okuma', 'Marangozluk', 'Fotoğrafçılık'])}
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> İlgi Alanları
              </label>
              {renderTagInput('father_interests', interestInput, setInterestInput, 'İlgi alanı ekle...', ['Tarih', 'Teknoloji', 'Spor', 'Müzik', 'Sinema', 'Yemek yapma', 'Seyahat', 'Doğa'])}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Favori Rengi
                </label>
                <input
                  type="text"
                  value={formData.father_favorite_color}
                  onChange={e => updateField('father_favorite_color', e.target.value)}
                  placeholder="Örn: Lacivert"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition"
                />
              </div>
              <div>
                <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4" /> Favori Yemeği
                </label>
                <input
                  type="text"
                  value={formData.father_favorite_food}
                  onChange={e => updateField('father_favorite_food', e.target.value)}
                  placeholder="Örn: Karnıyarık"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" /> Favori Müziği / Sanatçısı
              </label>
              <input
                type="text"
                value={formData.father_favorite_music}
                onChange={e => updateField('father_favorite_music', e.target.value)}
                placeholder="Örn: Türk Halk Müziği, Barış Manço..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> Babanın En Belirgin Özellikleri
              </label>
              <p className="text-white/50 text-sm mb-3">Babanı en iyi tanımlayan özellikleri ekle</p>
              {renderTagInput('father_qualities', qualityInput, setQualityInput, 'Özellik ekle...', ['Sabırlı', 'Cömert', 'Çalışkan', 'Komik', 'Bilge', 'Güçlü', 'Şefkatli', 'Disiplinli', 'Yaratıcı', 'Dürüst', 'Koruyucu', 'Fedakar'])}
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <BookHeart className="w-4 h-4" /> Babanla En Güzel Anın
              </label>
              <textarea
                value={formData.favorite_memory}
                onChange={e => updateField('favorite_memory', e.target.value)}
                placeholder="Babanla yaşadığın en güzel anıyı anlat... Örn: 'Babam beni her sabah omuzlarında okula götürürdü...'"
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-blue-200/70 text-sm">
              Fotoğraflar eklemek opsiyoneldir ama sayfayı çok daha özel kılar! 📸
            </p>
            <div>
              <label className="block text-amber-200 font-semibold mb-3">Babanın Fotoğrafı</label>
              <div
                onClick={() => fatherPhotoRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-amber-400/50 hover:bg-white/5 transition-all"
              >
                {photoPreviews.father ? (
                  <div className="relative inline-block">
                    <img src={photoPreviews.father} alt="Baba" className="w-48 h-48 object-cover rounded-xl mx-auto shadow-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPhotoPreviews(p => ({...p, father: null})); setPhotoFiles(p => ({...p, father: null})); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50">Babanın fotoğrafını seç</p>
                    <p className="text-white/30 text-sm mt-1">Tıkla veya sürükle bırak</p>
                  </div>
                )}
              </div>
              <input ref={fatherPhotoRef} type="file" accept="image/*" onChange={e => handlePhotoSelect(e, 'father')} className="hidden" />
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-3">Birlikte Fotoğrafınız</label>
              <div
                onClick={() => familyPhotoRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-amber-400/50 hover:bg-white/5 transition-all"
              >
                {photoPreviews.family ? (
                  <div className="relative inline-block">
                    <img src={photoPreviews.family} alt="Birlikte" className="w-48 h-48 object-cover rounded-xl mx-auto shadow-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPhotoPreviews(p => ({...p, family: null})); setPhotoFiles(p => ({...p, family: null})); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50">Birlikte çekilmiş bir fotoğraf seç</p>
                    <p className="text-white/30 text-sm mt-1">Tıkla veya sürükle bırak</p>
                  </div>
                )}
              </div>
              <input ref={familyPhotoRef} type="file" accept="image/*" onChange={e => handlePhotoSelect(e, 'family')} className="hidden" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-200 font-semibold mb-2">Senin Adın *</label>
              <input
                type="text"
                value={formData.creator_name}
                onChange={e => updateField('creator_name', e.target.value)}
                placeholder="Adın"
                className={`w-full bg-white/10 border ${errors.creator_name ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition`}
              />
              {errors.creator_name && <p className="text-red-400 text-sm mt-1">{errors.creator_name}</p>}
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2">Babanla İlişkin</label>
              <div className="flex gap-3">
                {['Oğul', 'Kız'].map(rel => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => updateField('creator_relationship', rel)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      formData.creator_relationship === rel
                        ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30'
                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {rel === 'Oğul' ? '👦' : '👧'} {rel}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-2">Baban Hakkında Kısa Bir Hikaye</label>
              <textarea
                value={formData.story}
                onChange={e => updateField('story', e.target.value)}
                placeholder="Baban hakkında anlatmak istediğin bir şey... Onun hayatı, karakteri, senin için anlamı..."
                rows={5}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition resize-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-200 font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Babana Özel Mesajın *
              </label>
              <p className="text-white/50 text-sm mb-3">
                Bu mesaj sayfada büyük ve güzel bir şekilde gösterilecek. İçinden geldiği gibi yaz...
              </p>
              <textarea
                value={formData.message}
                onChange={e => updateField('message', e.target.value)}
                placeholder="Canım Babam, sen benim hayatımdaki en büyük ilham kaynağısın. Senin gibi bir babaya sahip olduğum için çok şanslıyım..."
                rows={6}
                className={`w-full bg-white/10 border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition resize-none text-lg`}
              />
              {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              <p className="text-white/30 text-sm mt-1">{formData.message.length} karakter</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <p className="text-blue-200/70 text-center mb-4">
              Babana en uygun temayı seç — sayfada bu tema kullanılacak
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateField('theme', theme.id)}
                  className={`relative p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                    formData.theme === theme.id
                      ? 'border-amber-400 shadow-lg shadow-amber-400/20 scale-[1.02]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors[0]}40, ${theme.colors[2]}60)`,
                  }}
                >
                  {formData.theme === theme.id && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <h3 className="text-white font-bold text-lg mb-1">{theme.name}</h3>
                  <p className="text-white/60 text-sm mb-3">{theme.desc}</p>
                  <div className="flex gap-2">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i === step
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30'
                    : i < step
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 text-white/30'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-8 md:w-12 h-0.5 mx-1 transition-all ${i < step ? 'bg-green-500/30' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-amber-200 font-semibold text-lg">{steps[step].title}</p>
          <p className="text-white/40 text-sm">Adım {step + 1} / {steps.length}</p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            step === 0
              ? 'opacity-30 cursor-not-allowed text-white/30'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition shadow-lg shadow-amber-500/30"
          >
            İleri <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition shadow-lg shadow-amber-500/30 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditing ? 'Güncelleniyor...' : 'Oluşturuluyor...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {isEditing ? 'Güncellemeleri Kaydet' : 'Sayfayı Oluştur 💝'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
