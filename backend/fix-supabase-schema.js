import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU4MTE4OSwiZXhwIjoyMDY1MTU3MTg5fQ.N7V7dsIrCNqMObP0dRCCcn4ZgIVtBZ_qvgWupZAe3kI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSupabaseSchema() {
  console.log('🔧 Fixing Supabase schema cache issue...');
  
  try {
    // Step 1: Test if we can access the cvs table at all
    console.log('📋 Testing basic table access...');
    const { data: testData, error: testError } = await supabase
      .from('cvs')
      .select('id, title')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic table access failed:', testError);
      return;
    }
    
    console.log('✅ Basic table access successful');
    
    // Step 2: Try to insert a test record with is_public field
    console.log('\n🔧 Testing is_public column access...');
    const testRecord = {
      title: 'Schema Test CV',
      content: { 
        full_name: 'Test User',
        email: 'test@example.com'
      },
      is_public: false,
      user_id: '00000000-0000-0000-0000-000000000000' // dummy UUID for testing
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('cvs')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.error('❌ Insert with is_public failed:', insertError);
      
      // If the error mentions is_public, we need to fix the schema
      if (insertError.message.includes('is_public')) {
        console.log('\n🔧 Schema cache issue detected. Trying alternative approach...');
        
        // Try inserting without is_public first
        const { data: insertWithoutPublic, error: insertWithoutError } = await supabase
          .from('cvs')
          .insert({
            title: 'Schema Test CV 2',
            content: { 
              full_name: 'Test User 2',
              email: 'test2@example.com'
            },
            user_id: '00000000-0000-0000-0000-000000000000'
          })
          .select();
        
        if (insertWithoutError) {
          console.log('✅ Insert without is_public worked');
          
          // Now try to update with is_public
          const { error: updateError } = await supabase
            .from('cvs')
            .update({ is_public: false })
            .eq('id', insertWithoutPublic[0].id);
          
          if (updateError) {
            console.error('❌ Update with is_public failed:', updateError);
          } else {
            console.log('✅ Update with is_public worked - schema cache refreshed!');
          }
        } else {
          console.error('❌ Insert without is_public also failed:', insertWithoutError);
        }
      }
    } else {
      console.log('✅ Insert with is_public worked - schema is correct!');
      console.log('📊 Inserted record:', insertData);
      
      // Clean up test record
      if (insertData && insertData[0]) {
        await supabase
          .from('cvs')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Test record cleaned up');
      }
    }
    
    // Step 3: Final test
    console.log('\n🧪 Final schema test...');
    const { data: finalTest, error: finalError } = await supabase
      .from('cvs')
      .select('id, title, is_public')
      .limit(1);
    
    if (finalError) {
      console.error('❌ Final test failed:', finalError);
    } else {
      console.log('✅ Schema fix successful!');
      console.log('📊 Final test result:', finalTest);
    }
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  }
}

// Run the fix
fixSupabaseSchema(); 