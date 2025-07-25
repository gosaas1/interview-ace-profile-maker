import dotenv from 'dotenv';
import axios from 'axios';
import AWS from 'aws-sdk';

// Load environment variables
dotenv.config();

console.log('🔍 Testing API Connections...\n');

// 1. Test Cohere API
async function testCohere() {
  console.log('📡 Testing Cohere API...');
  
  if (!process.env.COHERE_API_KEY) {
    console.error('❌ COHERE_API_KEY not found in environment variables');
    return false;
  }

  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/embed',
      { 
        texts: ['Test text for API connection'], 
        model: 'embed-english-v3.0' 
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );
    
    console.log('✅ Cohere API working successfully');
    console.log(`   - Response status: ${response.status}`);
    console.log(`   - Embeddings generated: ${response.data.embeddings?.length || 0}`);
    return true;
  } catch (err: any) {
    console.error('❌ Cohere API failed:');
    if (err.response) {
      console.error(`   - Status: ${err.response.status}`);
      console.error(`   - Error: ${err.response.data?.message || err.response.statusText}`);
    } else if (err.request) {
      console.error('   - No response received (network error)');
    } else {
      console.error(`   - Error: ${err.message}`);
    }
    return false;
  }
}

// 2. Test AWS Textract
async function testTextract() {
  console.log('\n📡 Testing AWS Textract API...');
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in environment variables');
    console.error('   - AWS_ACCESS_KEY_ID: ' + (process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'));
    console.error('   - AWS_SECRET_ACCESS_KEY: ' + (process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'));
    return false;
  }

  try {
    const textract = new AWS.Textract({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // Create a simple test document (just text, not a real PDF)
    const testText = 'This is a test document for AWS Textract API connection testing.';
    const testDocument = Buffer.from(testText);

    const params = {
      Document: {
        Bytes: testDocument,
      },
      FeatureTypes: ['TABLES', 'FORMS'],
    };

    console.log('   - Sending test document to Textract...');
    const result = await textract.detectDocumentText({
      Document: {
        Bytes: testDocument,
      },
    }).promise();

    console.log('✅ AWS Textract API working successfully');
    console.log(`   - Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`   - Blocks detected: ${result.Blocks?.length || 0}`);
    console.log(`   - Text extracted: ${result.Blocks?.filter(block => block.BlockType === 'LINE').length || 0} lines`);
    return true;
  } catch (err: any) {
    console.error('❌ AWS Textract API failed:');
    if (err.code) {
      console.error(`   - Error code: ${err.code}`);
    }
    if (err.message) {
      console.error(`   - Error message: ${err.message}`);
    }
    if (err.statusCode) {
      console.error(`   - Status code: ${err.statusCode}`);
    }
    return false;
  }
}

// 3. Test Supabase Connection
async function testSupabase() {
  console.log('\n📡 Testing Supabase Connection...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found in environment variables');
    console.error('   - SUPABASE_URL: ' + (process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'));
    console.error('   - SUPABASE_ANON_KEY: ' + (process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'));
    return false;
  }

  try {
    const response = await axios.get(
      `${process.env.SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        timeout: 10000,
      }
    );
    
    console.log('✅ Supabase connection working successfully');
    console.log(`   - URL: ${process.env.SUPABASE_URL}`);
    console.log(`   - Response status: ${response.status}`);
    return true;
  } catch (err: any) {
    console.error('❌ Supabase connection failed:');
    if (err.response) {
      console.error(`   - Status: ${err.response.status}`);
      console.error(`   - Error: ${err.response.data?.message || err.response.statusText}`);
    } else if (err.request) {
      console.error('   - No response received (network error)');
    } else {
      console.error(`   - Error: ${err.message}`);
    }
    return false;
  }
}

// 4. Test Environment Variables
function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Variables...');
  
  const requiredVars = [
    'COHERE_API_KEY',
    'AWS_ACCESS_KEY_ID', 
    'AWS_SECRET_ACCESS_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ];

  const optionalVars = [
    'AWS_REGION',
    'NODE_ENV',
    'PORT'
  ];

  let allRequiredPresent = true;

  console.log('Required Variables:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allRequiredPresent = false;
    }
  });

  console.log('\nOptional Variables:');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value}`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (optional)`);
    }
  });

  return allRequiredPresent;
}

// 5. Test Network Connectivity
async function testNetworkConnectivity() {
  console.log('\n🌐 Testing Network Connectivity...');
  
  const endpoints = [
    'https://api.cohere.ai',
    'https://textract.us-east-1.amazonaws.com',
    'https://httpbin.org/get' // General internet connectivity test
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint, { timeout: 5000 });
      console.log(`   ✅ ${endpoint}: ${response.status}`);
    } catch (err: any) {
      console.log(`   ❌ ${endpoint}: ${err.message}`);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Connection Tests...\n');
  
  // Test environment variables first
  const envVarsOk = testEnvironmentVariables();
  
  // Test network connectivity
  await testNetworkConnectivity();
  
  // Test APIs
  const cohereOk = await testCohere();
  const textractOk = await testTextract();
  const supabaseOk = await testSupabase();
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`Environment Variables: ${envVarsOk ? '✅ All Required Present' : '❌ Missing Required'}`);
  console.log(`Cohere API: ${cohereOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`AWS Textract: ${textractOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Supabase: ${supabaseOk ? '✅ Working' : '❌ Failed'}`);
  
  const allWorking = envVarsOk && cohereOk && textractOk && supabaseOk;
  
  if (allWorking) {
    console.log('\n🎉 All tests passed! Your API connections are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix the issues.');
    
    if (!envVarsOk) {
      console.log('\n💡 Environment Variables Fix:');
      console.log('   - Check your .env file exists in the project root');
      console.log('   - Ensure all required API keys are set');
      console.log('   - Restart your development server after changing .env');
    }
    
    if (!cohereOk) {
      console.log('\n💡 Cohere API Fix:');
      console.log('   - Verify your COHERE_API_KEY is correct');
      console.log('   - Check your Cohere account has sufficient credits');
      console.log('   - Ensure your IP is not blocked');
    }
    
    if (!textractOk) {
      console.log('\n💡 AWS Textract Fix:');
      console.log('   - Verify your AWS credentials are correct');
      console.log('   - Check your AWS account has Textract permissions');
      console.log('   - Ensure your AWS region is correct');
    }
    
    if (!supabaseOk) {
      console.log('\n💡 Supabase Fix:');
      console.log('   - Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct');
      console.log('   - Check your Supabase project is active');
      console.log('   - Ensure your database is accessible');
    }
  }
  
  return allWorking;
}

// Run the tests
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test runner failed:', error);
      process.exit(1);
    });
}

export { runAllTests, testCohere, testTextract, testSupabase, testEnvironmentVariables }; 