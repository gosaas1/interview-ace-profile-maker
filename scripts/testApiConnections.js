import dotenv from 'dotenv';
import axios from 'axios';
import AWS from 'aws-sdk';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: './backend/backend.env' });

console.log('🔍 Testing API Connections...\n');

// Test Cohere API
async function testCohere() {
  console.log('1. Testing Cohere API...');
  try {
    const cohereApiKey = process.env.COHERE_API_KEY;
    if (!cohereApiKey) {
      console.log('❌ COHERE_API_KEY not found in environment variables');
      return false;
    }

    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: 'Hello, this is a test.',
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      console.log('✅ Cohere API connection successful');
      return true;
    } else {
      console.log('❌ Cohere API connection failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Cohere API connection failed:', error.message);
    return false;
  }
}

// Test AWS Textract
async function testAWS() {
  console.log('\n2. Testing AWS Textract...');
  try {
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const awsRegion = process.env.AWS_REGION || 'us-east-1';

    if (!awsAccessKeyId || !awsSecretAccessKey) {
      console.log('❌ AWS credentials not found in environment variables');
      return false;
    }

    // Configure AWS
    AWS.config.update({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: awsRegion
    });

    const textract = new AWS.Textract();
    
    // Test with a simple document analysis (this will fail but shows credentials work)
    try {
      await textract.detectDocumentText({
        Document: {
          Bytes: Buffer.from('test')
        }
      }).promise();
    } catch (error) {
      if (error.code === 'InvalidDocumentException') {
        console.log('✅ AWS Textract credentials valid (expected error for test document)');
        return true;
      } else {
        console.log('❌ AWS Textract connection failed:', error.message);
        return false;
      }
    }
  } catch (error) {
    console.log('❌ AWS Textract connection failed:', error.message);
    return false;
  }
}

// Test Supabase
async function testSupabase() {
  console.log('\n3. Testing Supabase...');
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase credentials not found in environment variables');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by fetching a single row
    const { data, error } = await supabase
      .from('cvs')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Supabase connection successful (no data found, which is expected)');
        return true;
      } else {
        console.log('❌ Supabase connection failed:', error.message);
        return false;
      }
    } else {
      console.log('✅ Supabase connection successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API connection tests...\n');
  
  const results = {
    cohere: await testCohere(),
    aws: await testAWS(),
    supabase: await testSupabase()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Cohere API: ${results.cohere ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AWS Textract: ${results.aws ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Supabase: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All API connections successful!');
  } else {
    console.log('\n⚠️  Some API connections failed. Check your environment variables.');
    console.log('\nRequired environment variables:');
    console.log('- COHERE_API_KEY');
    console.log('- AWS_ACCESS_KEY_ID');
    console.log('- AWS_SECRET_ACCESS_KEY');
    console.log('- AWS_REGION (optional, defaults to us-east-1)');
    console.log('- SUPABASE_URL');
    console.log('- SUPABASE_ANON_KEY');
  }

  return allPassed;
}

// Run the tests
runTests().catch(console.error); 