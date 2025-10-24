const { createClient } = require('@supabase/supabase-js');

let supabase;

const connectDB = async () => {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check your environment variables.');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected for new projects
      throw error;
    }
    
    console.log('📊 Supabase Connected Successfully');
    
  } catch (error) {
    console.warn('⚠️ Supabase connection failed - Server will continue with sample data');
    console.warn('Error details:', error.message);
    // Don't exit the process, let the server continue running
  }
};

// Get Supabase client instance
const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Make sure to call connectDB() first.');
  }
  return supabase;
};

module.exports = { connectDB, getSupabaseClient };
