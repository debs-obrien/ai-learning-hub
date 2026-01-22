import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Safety check: Ensure we have the required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure .env.test.local exists with:\n' +
    '  NEXT_PUBLIC_SUPABASE_URL\n' +
    '  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  );
}

// Create Supabase client for test database
export const testSupabase = createClient(supabaseUrl, supabaseKey);

/**
 * Seed test data into the database
 */
export async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  // Clear any existing data first
  await cleanupTestData();
  
  // Insert test resources
  const { data: resources, error: resourceError } = await testSupabase
    .from('resources')
    .insert([
      {
        url: 'https://example.com/test-article',
        title: 'Test Article',
        description: 'This is a test article for E2E testing',
        category: 'blog',
        status: 'to_learn',
        priority: 1
      },
      {
        url: 'https://example.com/test-video',
        title: 'Test Video',
        description: 'This is a test video for E2E testing',
        category: 'video',
        status: 'learning',
        priority: 2
      },
      {
        url: 'https://example.com/test-course',
        title: 'Test Course',
        description: 'This is a test course for E2E testing',
        category: 'course',
        status: 'completed',
        priority: 3
      }
    ])
    .select();
    
  if (resourceError) {
    console.error('❌ Error seeding resources:', resourceError);
    throw resourceError;
  }
  
  // Insert test content ideas
  const { data: ideas, error: ideaError } = await testSupabase
    .from('content_ideas')
    .insert([
      {
        title: 'Test Blog Post Idea',
        description: 'Write about testing with Playwright',
        type: 'blog_post',
        status: 'idea'
      },
      {
        title: 'Test Video Idea',
        description: 'Create a video about E2E testing',
        type: 'video',
        status: 'drafting'
      }
    ])
    .select();
    
  if (ideaError) {
    console.error('❌ Error seeding ideas:', ideaError);
    throw ideaError;
  }
  
  const safeResources = resources ?? [];
  const safeIdeas = ideas ?? [];
  console.log(`✅ Seeded ${safeResources.length} test resources and ${safeIdeas.length} test ideas`);
  return { resources: safeResources, ideas: safeIdeas };
}

/**
 * Clean up all data from the test database
 */
export async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  // Delete all resources (use not('id', 'is', null) to match all rows)
  const { error: resourceError, count: resourceCount } = await testSupabase
    .from('resources')
    .delete({ count: 'exact' })
    .not('id', 'is', null);
    
  if (resourceError) {
    console.error('❌ Error cleaning resources:', resourceError);
  } else {
    console.log(`   Deleted ${resourceCount || 0} resources`);
  }
  
  // Delete all content ideas (use not('id', 'is', null) to match all rows)
  const { error: ideaError, count: ideaCount } = await testSupabase
    .from('content_ideas')
    .delete({ count: 'exact' })
    .not('id', 'is', null);
    
  if (ideaError) {
    console.error('❌ Error cleaning ideas:', ideaError);
  } else {
    console.log(`   Deleted ${ideaCount || 0} ideas`);
  }
}

/**
 * Get count of data in the test database
 */
export async function getTestDataCount() {
  const { count: resourceCount } = await testSupabase
    .from('resources')
    .select('*', { count: 'exact', head: true });
    
  const { count: ideaCount } = await testSupabase
    .from('content_ideas')
    .select('*', { count: 'exact', head: true });
    
  return { resourceCount: resourceCount || 0, ideaCount: ideaCount || 0 };
}
