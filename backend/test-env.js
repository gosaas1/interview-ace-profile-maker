import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('Testing environment variables...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'FOUND' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'FOUND' : 'MISSING');

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('✅ Environment variables loaded successfully!');
  
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase client created successfully!');
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error.message);
  }
} else {
  console.error('❌ Missing environment variables!');
  process.exit(1);
} 