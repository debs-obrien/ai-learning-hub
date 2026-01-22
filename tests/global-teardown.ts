import { FullConfig } from '@playwright/test';
import { cleanupTestData } from './helpers/database';

async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Global Teardown: Starting...');
  
  try {
    await cleanupTestData();
    console.log('✅ Global Teardown: Complete\n');
  } catch (error) {
    console.error('❌ Global Teardown: Failed', error);
    // Don't throw - we don't want to fail the test run if cleanup fails
  }
}

export default globalTeardown;
