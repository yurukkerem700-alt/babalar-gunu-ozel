import supabase from './db-client.js';

const turkishToEnglish = (str) => {
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const generateSlug = (name) => {
  const base = turkishToEnglish(name);
  const random = Math.random().toString(36).substring(2, 8);
  return `baba-${base}-${random}`;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug } = req.query;
      if (slug) {
        const { data, error } = await supabase
          .from('father_pages')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Sayfa bulunamadı' });
        return res.status(200).json(data);
      }
      const { data, error } = await supabase
        .from('father_pages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const body = req.body;
      console.log('POST request received:', {
        father_name: body.father_name,
        has_father_photo: !!body.fatherPhotoBase64,
        has_family_photo: !!body.familyPhotoBase64,
        theme: body.theme,
      });

      const slug = generateSlug(body.father_name || 'babam');

      let father_photo_url = null;
      let family_photo_url = null;

      // Father photo upload
      if (body.fatherPhotoBase64) {
        try {
          const buffer = Buffer.from(body.fatherPhotoBase64, 'base64');
          const fileName = `father-${slug}-${Date.now()}.jpg`;
          console.log('Uploading father photo:', fileName, 'Size:', Math.round(buffer.length / 1024), 'KB');
          
          const { error: uploadError } = await supabase.storage
            .from('father-photos')
            .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
          
          if (uploadError) {
            console.error('Father photo upload error:', uploadError);
          } else {
            const { data: urlData } = supabase.storage.from('father-photos').getPublicUrl(fileName);
            father_photo_url = urlData.publicUrl;
            console.log('Father photo uploaded:', father_photo_url);
          }
        } catch (err) {
          console.error('Father photo upload failed:', err);
        }
      }

      // Family photo upload
      if (body.familyPhotoBase64) {
        try {
          const buffer = Buffer.from(body.familyPhotoBase64, 'base64');
          const fileName = `family-${slug}-${Date.now()}.jpg`;
          console.log('Uploading family photo:', fileName, 'Size:', Math.round(buffer.length / 1024), 'KB');
          
          const { error: uploadError } = await supabase.storage
            .from('father-photos')
            .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
          
          if (uploadError) {
            console.error('Family photo upload error:', uploadError);
          } else {
            const { data: urlData } = supabase.storage.from('father-photos').getPublicUrl(fileName);
            family_photo_url = urlData.publicUrl;
            console.log('Family photo uploaded:', family_photo_url);
          }
        } catch (err) {
          console.error('Family photo upload failed:', err);
        }
      }

      // Database insert
      const insertData = {
        slug,
        father_name: body.father_name,
        birth_date: body.birth_date,
        father_occupation: body.father_occupation || null,
        father_favorite_color: body.father_favorite_color || null,
        father_favorite_food: body.father_favorite_food || null,
        father_favorite_music: body.father_favorite_music || null,
        father_hobbies: body.father_hobbies || [],
        father_interests: body.father_interests || [],
        father_photo_url,
        family_photo_url,
        message: body.message || null,
        story: body.story || null,
        creator_name: body.creator_name,
        creator_relationship: body.creator_relationship || null,
        father_qualities: body.father_qualities || [],
        favorite_memory: body.favorite_memory || null,
        theme: body.theme || 'klasik',
      };

      console.log('Inserting data:', { slug, father_name: insertData.father_name, theme: insertData.theme });

      const { data, error } = await supabase
        .from('father_pages')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Page created successfully:', data.slug);
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { slug } = req.query;
      if (!slug) return res.status(400).json({ error: 'Slug gerekli' });
      const body = req.body;

      let father_photo_url = body.father_photo_url;
      let family_photo_url = body.family_photo_url;

      if (body.fatherPhotoBase64) {
        const buffer = Buffer.from(body.fatherPhotoBase64, 'base64');
        const fileName = `father-${slug}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('father-photos')
          .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('father-photos').getPublicUrl(fileName);
          father_photo_url = urlData.publicUrl;
        }
      }

      if (body.familyPhotoBase64) {
        const buffer = Buffer.from(body.familyPhotoBase64, 'base64');
        const fileName = `family-${slug}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('father-photos')
          .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('father-photos').getPublicUrl(fileName);
          family_photo_url = urlData.publicUrl;
        }
      }

      const updateData = {
        father_name: body.father_name,
        birth_date: body.birth_date,
        father_occupation: body.father_occupation || null,
        father_favorite_color: body.father_favorite_color || null,
        father_favorite_food: body.father_favorite_food || null,
        father_favorite_music: body.father_favorite_music || null,
        father_hobbies: body.father_hobbies || [],
        father_interests: body.father_interests || [],
        message: body.message || null,
        story: body.story || null,
        creator_name: body.creator_name,
        creator_relationship: body.creator_relationship || null,
        father_qualities: body.father_qualities || [],
        favorite_memory: body.favorite_memory || null,
        theme: body.theme || 'klasik',
        updated_at: new Date().toISOString(),
      };

      if (father_photo_url !== undefined) updateData.father_photo_url = father_photo_url;
      if (family_photo_url !== undefined) updateData.family_photo_url = family_photo_url;

      const { data, error } = await supabase
        .from('father_pages')
        .update(updateData)
        .eq('slug', slug)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
