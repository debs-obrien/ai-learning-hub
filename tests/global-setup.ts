import { FullConfig } from '@playwright/test';
import { seedTestData } from './helpers/database';

async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Global Setup: Starting...');
  
  try {
    await seedTestData();
    console.log('✅ Global Setup: Complete\n');
  } catch (error) {
    console.error('❌ Global Setup: Failed', error);
    throw error;
  }
}

export default globalSetup;
