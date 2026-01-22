// Reuse the Supabase client from test helpers to avoid duplication
import { testSupabase as supabase } from '../tests/helpers/database';

// Sample resources for testing and design
const sampleResources = [
  {
    url: 'https://playwright.dev/docs/intro',
    title: 'Getting Started with Playwright',
    description: 'Learn how to install Playwright, run the example test, and see trace viewer in action.',
    category: 'course',
    status: 'completed',
    priority: 1
  },
  {
    url: 'https://www.youtube.com/watch?v=Xz6lhEzgI5I',
    title: 'Playwright Tutorial for Beginners',
    description: 'A comprehensive video tutorial covering Playwright fundamentals, test writing, and best practices.',
    category: 'video',
    status: 'completed',
    priority: 2
  },
  {
    url: 'https://dev.to/playwright/playwright-tips-and-tricks-1',
    title: 'Playwright Tips and Tricks',
    description: 'Advanced techniques for writing robust and maintainable Playwright tests.',
    category: 'blog',
    status: 'learning',
    priority: 3
  },
  {
    url: 'https://www.coursera.org/learn/ai-for-everyone',
    title: 'AI For Everyone',
    description: 'Andrew Ng teaches the basics of AI in this accessible course designed for non-technical learners.',
    category: 'course',
    status: 'to_learn',
    priority: 4
  },
  {
    url: 'https://arxiv.org/abs/2303.08774',
    title: 'GPT-4 Technical Report',
    description: 'OpenAI technical report describing GPT-4, a large-scale multimodal model.',
    category: 'paper',
    status: 'to_learn',
    priority: 5
  },
  {
    url: 'https://changelog.com/podcast/ai',
    title: 'The Changelog: AI Edition',
    description: 'Podcast episodes covering the latest developments in AI and machine learning.',
    category: 'podcast',
    status: 'to_learn',
    priority: 6
  },
  {
    url: 'https://nextjs.org/docs',
    title: 'Next.js Documentation',
    description: 'The official Next.js documentation covering App Router, Server Components, and more.',
    category: 'course',
    status: 'learning',
    priority: 7
  },
  {
    url: 'https://react.dev/learn',
    title: 'React Learn Tutorial',
    description: 'The new official React documentation with interactive examples and exercises.',
    category: 'course',
    status: 'completed',
    priority: 8
  },
  {
    url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    title: 'Understanding TypeScript Generics',
    description: 'Deep dive into TypeScript generics with practical examples and patterns.',
    category: 'blog',
    status: 'to_learn',
    priority: 9
  },
  {
    url: 'https://testing-library.com/docs/',
    title: 'Testing Library Documentation',
    description: 'Simple and complete testing utilities that encourage good testing practices.',
    category: 'course',
    status: 'to_learn',
    priority: 10
  }
];

// Sample content ideas
const sampleIdeas = [
  {
    title: 'Playwright vs Cypress Comparison',
    description: 'Write a detailed comparison of Playwright and Cypress for E2E testing.',
    type: 'blog_post',
    status: 'idea'
  },
  {
    title: 'Building a Test Automation Framework',
    description: 'Create a video tutorial showing how to build a scalable test automation framework.',
    type: 'video',
    status: 'drafting'
  },
  {
    title: 'AI-Powered Test Generation',
    description: 'Explore how AI can be used to generate and maintain E2E tests automatically.',
    type: 'blog_post',
    status: 'idea'
  },
  {
    title: 'Supabase + Next.js Full Stack Guide',
    description: 'Step-by-step tutorial on building a full-stack app with Next.js and Supabase.',
    type: 'tutorial',
    status: 'idea'
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding test database with sample data...\n');
  
  let hasError = false;
  let resourcesCount = 0;
  let ideasCount = 0;

  // Clear existing data (use not('id', 'is', null) to match all rows)
  console.log('🧹 Clearing existing data...');
  const { error: resourcesDeleteError } = await supabase.from('resources').delete().not('id', 'is', null);
  if (resourcesDeleteError) {
    console.error('   ❌ Error clearing resources:', resourcesDeleteError.message);
    hasError = true;
  }
  const { error: ideasDeleteError } = await supabase.from('content_ideas').delete().not('id', 'is', null);
  if (ideasDeleteError) {
    console.error('   ❌ Error clearing content ideas:', ideasDeleteError.message);
    hasError = true;
  }
  if (!resourcesDeleteError && !ideasDeleteError) {
    console.log('   ✅ Cleared existing data\n');
  } else {
    console.log('');
  }
  
  // Insert sample resources
  console.log('📚 Inserting sample resources...');
  const { data: resources, error: resourcesError } = await supabase.from('resources').insert(sampleResources).select();
  if (resourcesError) {
    console.error('   ❌ Error inserting resources:', resourcesError.message);
    hasError = true;
  } else {
    resourcesCount = resources?.length || 0;
    console.log(`   ✅ Inserted ${resourcesCount} resources`);
  }
  
  // Insert sample ideas
  console.log('💡 Inserting sample content ideas...');
  const { data: ideas, error: ideasError } = await supabase.from('content_ideas').insert(sampleIdeas).select();
  if (ideasError) {
    console.error('   ❌ Error inserting content ideas:', ideasError.message);
    hasError = true;
  } else {
    ideasCount = ideas?.length || 0;
    console.log(`   ✅ Inserted ${ideasCount} ideas`);
  }

  if (hasError) {
    console.error('\n❌ One or more errors occurred while seeding the database.');
    process.exit(1);
  }
  
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Resources: ${resourcesCount}`);
  console.log(`     - To Learn: ${sampleResources.filter(r => r.status === 'to_learn').length}`);
  console.log(`     - Learning: ${sampleResources.filter(r => r.status === 'learning').length}`);
  console.log(`     - Completed: ${sampleResources.filter(r => r.status === 'completed').length}`);
  console.log(`   Content Ideas: ${ideasCount}`);
}

seedDatabase().catch((error) => {
  console.error('❌ Unexpected error while seeding the database:', error);
  process.exit(1);
});
