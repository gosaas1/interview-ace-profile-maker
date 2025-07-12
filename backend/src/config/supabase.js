const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODExODksImV4cCI6MjA2NTE1NzE4OX0.o_c4yk6tKYM17uTXtdepkRWR4PUp71lflaciAcLB6i4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 