// Test script for backend endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

async function testBackend() {
  console.log('🧪 Testing Backend Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test CV creation with minimal data
    console.log('2. Testing CV creation...');
    const testCV = {
      title: 'Test CV',
      content: {
        full_name: 'John Doe',
        email: 'john@example.com',
        summary: 'Test summary'
      },
      is_public: false
    };

    const createResponse = await fetch(`${BASE_URL}/api/cv/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCV)
    });

    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ CV created successfully:', createData);
    } else {
      console.log('❌ CV creation failed:', createData);
      
      if (createData.code === 'SCHEMA_CACHE_ERROR') {
        console.log('⚠️  Schema cache error detected. This needs to be fixed in Supabase.');
      }
    }
    console.log('');

    // Test CV retrieval
    console.log('3. Testing CV retrieval...');
    const getResponse = await fetch(`${BASE_URL}/api/cv`);
    const getData = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ CVs retrieved successfully:', getData);
    } else {
      console.log('❌ CV retrieval failed:', getData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackend(); 