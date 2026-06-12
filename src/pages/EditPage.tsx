import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CreateForm from '../components/CreateForm';

interface FatherPageData {
  slug: string;
  father_name: string;
  birth_date: string;
  father_occupation: string;
  father_favorite_color: string;
  father_favorite_food: string;
  father_favorite_music: string;
  father_hobbies: string[];
  father_interests: string[];
  father_photo_url: string | null;
  family_photo_url: string | null;
  message: string;
  story: string;
  creator_name: string;
  creator_relationship: string;
  father_qualities: string[];
  favorite_memory: string;
  theme: string;
}

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageData, setPageData] = useState<FatherPageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log('Fetching page for edit:', slug);
        const res = await fetch(`/api/pages?slug=${slug}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API response error:', res.status, errorText);
          throw new Error(`Sayfa bulunamadı (${res.status})`);
        }
        
        const data = await res.json();
        console.log('Page data loaded for edit:', data);
        setPageData(data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const handleSave = async (formData: any) => {
    setSaving(true);
    setError('');
    
    try {
      console.log('Saving changes for slug:', slug);
      const res = await fetch(`/api/pages?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Bilinmeyen hata' }));
        console.error('Update error:', errorData);
        throw new Error(errorData.error || 'Güncelleme başarısız');
      }
      
      const updatedData = await res.json();
      console.log('Page updated successfully:', updatedData);
      
      setSaved(true);
      setTimeout(() => navigate(`/baba/${slug}`), 2000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError('Güncelleme hatası: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-200 text-lg">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">❌ {error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-bold hover:bg-amber-400 transition">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-300 mb-2">
            Sayfayı Düzenle
          </h1>
          <p className="text-blue-200">
            {pageData?.father_name} için oluşturduğun sayfayı güncelle
          </p>
        </motion.div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-green-300 text-lg font-semibold">✅ Sayfa başarıyla güncellendi! Yönlendiriliyorsunuz...</p>
          </motion.div>
        )}

        {pageData && (
          <CreateForm
            initialData={pageData}
            onSubmit={handleSave}
            isEditing={true}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}
