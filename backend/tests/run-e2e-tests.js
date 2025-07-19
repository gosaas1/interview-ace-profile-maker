import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Test configuration
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU4MTE4OSwiZXhwIjoyMDY1MTU3MTg5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test suites to run
const testSuites = [
  'parsing-flow.test.js',
  'ai-rewrite-flow.test.js',
  'job-apply-flow.test.js',
  'interview-flow.test.js'
];

async function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...');
  
  try {
    // Check if servers are running
    await checkServerHealth();
    
    // Create test fixtures directory if it doesn't exist
    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    // Create sample CV files for testing
    await createTestFixtures();
    
    console.log('✅ Test environment setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}

async function checkServerHealth() {
  console.log('🏥 Checking server health...');
  
  try {
    // Check backend server
    const backendResponse = await fetch(`${API_URL}/health`);
    if (!backendResponse.ok) {
      throw new Error(`Backend server not healthy: ${backendResponse.status}`);
    }
    
    // Check frontend server
    const frontendResponse = await fetch(`${BASE_URL}`);
    if (!frontendResponse.ok) {
      throw new Error(`Frontend server not healthy: ${frontendResponse.status}`);
    }
    
    console.log('✅ Servers are healthy');
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    console.log('💡 Make sure both frontend and backend servers are running:');
    console.log('   Frontend: npm run dev (port 3000)');
    console.log('   Backend: npm run server (port 8000)');
    throw error;
  }
}

async function createTestFixtures() {
  console.log('📄 Creating test fixtures...');
  
  const fixturesDir = path.join(__dirname, 'fixtures');
  
  // Create sample CV PDF content (simplified)
  const sampleCVContent = `
    John Doe
    john.doe@example.com
    (555) 123-4567
    San Francisco, CA
    
    SUMMARY
    Experienced software engineer with 5+ years in web development
    
    EXPERIENCE
    Senior Software Engineer
    Tech Corp | 2020-2023
    - Led development of scalable web applications
    - Managed team of 5 developers
    - Implemented CI/CD pipelines
    
    SKILLS
    JavaScript, React, Node.js, AWS, Docker
  `;
  
  // Create sample files
  const fixtures = [
    {
      name: 'sample-cv.pdf',
      content: sampleCVContent,
      type: 'pdf'
    },
    {
      name: 'sample-cv.docx',
      content: sampleCVContent,
      type: 'docx'
    },
    {
      name: 'sample-cv.txt',
      content: sampleCVContent,
      type: 'txt'
    },
    {
      name: 'sample-cv-2.pdf',
      content: sampleCVContent + '\n\nAdditional experience...',
      type: 'pdf'
    },
    {
      name: 'invalid-file.txt',
      content: 'This is not a valid CV file',
      type: 'txt'
    }
  ];
  
  for (const fixture of fixtures) {
    const filePath = path.join(fixturesDir, fixture.name);
    fs.writeFileSync(filePath, fixture.content);
  }
  
  console.log('✅ Test fixtures created');
}

async function runTestSuite(suiteName) {
  console.log(`🧪 Running test suite: ${suiteName}`);
  
  try {
    const testPath = path.join(__dirname, 'e2e', suiteName);
    
    // Run the test suite using Playwright
    const command = `npx playwright test ${testPath} --reporter=line --timeout=120000`;
    
    console.log(`Executing: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        FRONTEND_URL: BASE_URL,
        BACKEND_URL: API_URL,
        SUPABASE_URL: supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: supabaseKey
      }
    });
    
    console.log(`✅ Test suite completed: ${suiteName}`);
    return true;
  } catch (error) {
    console.error(`❌ Test suite failed: ${suiteName}`, error);
    return false;
  }
}

async function cleanupTestEnvironment() {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    // Clean up test users created during tests
    const { data: testUsers, error } = await supabase.auth.admin.listUsers();
    
    if (!error && testUsers) {
      for (const user of testUsers.users) {
        if (user.email.includes('test-') && user.email.includes('@example.com')) {
          console.log(`Deleting test user: ${user.email}`);
          await supabase.auth.admin.deleteUser(user.id);
        }
      }
    }
    
    // Clean up test data
    await supabase.from('usage_history').delete().like('user_id', '%');
    await supabase.from('parsing_logs').delete().like('user_id', '%');
    await supabase.from('interview_sessions').delete().like('user_id', '%');
    await supabase.from('job_applications').delete().like('user_id', '%');
    await supabase.from('jobs').delete().like('user_id', '%');
    await supabase.from('cvs').delete().like('user_id', '%');
    
    console.log('✅ Test environment cleanup complete');
  } catch (error) {
    console.error('❌ Failed to cleanup test environment:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting E2E test suite...');
  console.log(`Frontend URL: ${BASE_URL}`);
  console.log(`Backend URL: ${API_URL}`);
  
  const startTime = Date.now();
  let passedTests = 0;
  let failedTests = 0;
  
  try {
    // Setup
    await setupTestEnvironment();
    
    // Run each test suite
    for (const suite of testSuites) {
      const success = await runTestSuite(suite);
      if (success) {
        passedTests++;
      } else {
        failedTests++;
      }
    }
    
    // Cleanup
    await cleanupTestEnvironment();
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n📊 Test Results Summary:');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);
    
    if (failedTests > 0) {
      console.log('\n💡 Some tests failed. Check the logs above for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
    
  } catch (error) {
    console.error('💥 Test suite execution failed:', error);
    await cleanupTestEnvironment();
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests, runTestSuite, setupTestEnvironment, cleanupTestEnvironment }; 
 
 