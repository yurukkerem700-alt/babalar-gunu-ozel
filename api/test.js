import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('father_pages')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Supabase query error',
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      data: data,
      env_check: {
        has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Exception caught',
      message: err.message,
      stack: err.stack
    });
  }
}
