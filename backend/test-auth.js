// backend/test-auth.js

const fetch = require('node-fetch');
require('dotenv').config();

const baseUrl = 'http://localhost:8000';
const validToken = process.env.TOKEN;

async function runTest(name, options = {}) {
  console.log(`\n🧪 ${name}`);
  try {
    const res = await fetch(`${baseUrl}/api/cv/debug-auth`, options);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

(async () => {
  // 1) No auth header
  await runTest('1) No Auth');

  // 2) Invalid token
  await runTest('2) Invalid Token', {
    headers: { 'Authorization': 'Bearer invalid-token' }
  });

  // 3) Valid token
  if (!validToken) {
    console.error('\n❌ ERROR: No valid TOKEN in .env; copy .env.example → .env, set TOKEN=<your_jwt>, then rerun this script.');
    process.exit(1);
  }
  await runTest('3) Valid Token', {
    headers: { 'Authorization': `Bearer ${validToken}` }
  });

  console.log('\n✅ All tests complete');
  process.exit(0);
})(); 