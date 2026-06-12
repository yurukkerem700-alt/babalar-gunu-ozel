import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Test POST body:', JSON.stringify(body));

      const insertData = {
        slug: 'test-' + Date.now(),
        father_name: body.father_name || 'Test Baba',
        birth_date: body.birth_date || '1970-01-01',
        creator_name: body.creator_name || 'Test User',
        father_hobbies: body.father_hobbies || [],
        father_interests: body.father_interests || [],
        father_qualities: body.father_qualities || [],
        theme: 'klasik',
      };

      console.log('Attempting insert:', JSON.stringify(insertData));

      const { data, error } = await supabase
        .from('father_pages')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Insert error:', JSON.stringify(error, null, 2));
        return res.status(500).json({
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          full_error: error
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Insert successful',
        data: data
      });
    } catch (err) {
      console.error('Exception:', err);
      return res.status(500).json({
        success: false,
        error: 'Exception',
        message: err.message,
        stack: err.stack
      });
    }
  }

  return res.status(200).json({ message: 'Use POST method' });
}
