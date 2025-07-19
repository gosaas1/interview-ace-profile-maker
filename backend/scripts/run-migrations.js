import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU4MTE4OSwiZXhwIjoyMDY1MTU3MTg5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

const migrations = [
  '001_usage_history.sql',
  '002_parsing_logs.sql',
  '003_user_tier_lookup.sql'
];

async function runMigration(migrationFile) {
  try {
    console.log(`🔄 Running migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error executing statement:`, error);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
          throw error;
        }
      }
    }
    
    console.log(`✅ Migration completed: ${migrationFile}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`, error);
    throw error;
  }
}

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    for (const migration of migrations) {
      await runMigration(migration);
    }
    
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations }; 
 
 