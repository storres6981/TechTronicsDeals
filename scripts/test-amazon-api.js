import { searchAmazonProducts } from '../src/lib/services/amazonApiService.js';

async function testAmazonApi() {
  try {
    console.log('Testing Amazon Product Advertising API...');
    const results = await searchAmazonProducts('laptop');
    console.log('API Results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAmazonApi();