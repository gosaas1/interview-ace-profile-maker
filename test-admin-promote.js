const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/backend.env' });

// Test script for admin promotion functionality
async function testAdminPromotion() {
  console.log('🧪 Testing Admin Promotion Functionality...\n');

  // Initialize Supabase client with service role key
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend/backend.env');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Test email to promote
    const testEmail = 'gosaasltd@gmail.com';
    console.log(`📧 Testing promotion for: ${testEmail}`);

    // Step 1: Find the user
    console.log('\n1️⃣ Finding user...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return;
    }

    const user = users.find(u => u.email === testEmail);
    if (!user) {
      console.error(`❌ User not found: ${testEmail}`);
      console.log('Available users:');
      users.forEach(u => console.log(`  - ${u.email} (${u.user_metadata?.role || 'no role'})`));
      return;
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`   Current role: ${user.user_metadata?.role || 'none'}`);

    // Step 2: Promote to admin
    console.log('\n2️⃣ Promoting user to admin...');
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, role: 'admin' }
    });

    if (updateError) {
      console.error('❌ Error promoting user:', updateError);
      return;
    }

    console.log('✅ User promoted successfully!');
    console.log(`   New role: ${data.user.user_metadata?.role}`);
    console.log(`   Updated metadata:`, data.user.user_metadata);

    // Step 3: Verify the change
    console.log('\n3️⃣ Verifying the change...');
    const { data: { users: updatedUsers }, error: verifyError } = await supabase.auth.admin.listUsers();
    
    if (verifyError) {
      console.error('❌ Error verifying user:', verifyError);
      return;
    }

    const updatedUser = updatedUsers.find(u => u.email === testEmail);
    if (updatedUser?.user_metadata?.role === 'admin') {
      console.log('✅ Verification successful! User is now an admin.');
    } else {
      console.error('❌ Verification failed! User role was not updated correctly.');
    }

    console.log('\n🎉 Admin promotion test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Log in with Google SSO using gosaasltd@gmail.com');
    console.log('2. Visit /admin-login to access admin pages');
    console.log('3. You should now have admin access to all admin pages');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testAdminPromotion().catch(console.error); 