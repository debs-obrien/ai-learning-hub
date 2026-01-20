-- =====================================================
-- SUPABASE MIGRATION SCRIPT
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- Step 1: Create tables
-- =====================================================

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'to_learn',
  priority INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  favicon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS content_ideas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'blog_post',
  status TEXT NOT NULL DEFAULT 'idea',
  linked_resource_ids TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert your existing resources data
-- =====================================================

INSERT INTO resources (id, url, title, description, category, status, priority, notes, favicon, created_at, updated_at, completed_at) VALUES
(2, 'https://www.deeplearning.ai/the-batch/', 'The Batch | DeepLearning.AI | AI News & Insights', 'Weekly AI news for engineers, executives, and enthusiasts.', 'blog', 'to_learn', 1, NULL, NULL, to_timestamp(1768677543), to_timestamp(1768677543), NULL),
(4, 'https://www.youtube.com/watch?v=fabAI1OKKww', 'The complete guide to Agent Skills', '"Please, please stop making me learn new things.". If that''s you, I hear you. But Agent Skills are actually simple to understand and pretty powerful. They ar...', 'video', 'to_learn', 3, NULL, NULL, to_timestamp(1768678240), to_timestamp(1768678240), NULL),
(5, 'https://www.linkedin.com/video/live/urn:li:ugcPost:7401351102937440257/', 'the #techcommute with Amanda Martin | Jason Torres', 'the #techcommute with Amanda Martin', 'video', 'to_learn', 4, NULL, NULL, to_timestamp(1768678287), to_timestamp(1768678287), NULL),
(6, 'https://www.youtube.com/watch?v=y31fTNjyQuc', 'Betting On Open Source: Inside Agentic AI Foundation', 'Why are Block, Anthropic & OpenAI uniting on open source agentic AI?  Hear from the creators of MCP, goose, and AGENTS.md in a virtual fireside chat.Bradley ...', 'video', 'to_learn', 5, NULL, NULL, to_timestamp(1768678331), to_timestamp(1768678331), NULL),
(7, 'https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04', 'Welcome to Gas Town', 'Happy New Year, and Welcome to Gas Town!', 'blog', 'to_learn', 6, NULL, NULL, to_timestamp(1768678379), to_timestamp(1768678379), NULL),
(8, 'https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum', 'claude-code/plugins/ralph-wiggum at main · anthropics/claude-code', 'Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflo...', 'other', 'to_learn', 7, NULL, NULL, to_timestamp(1768678432), to_timestamp(1768678432), NULL),
(9, 'https://ghuntley.com/agent/', 'how to build a coding agent: free workshop', 'It''s not that hard to build a coding agent. 300 lines of code running in a loop with LLM tokens. You just keep throwing tokens at the loop, and then you''ve got yourself an agent.', 'other', 'to_learn', 8, NULL, NULL, to_timestamp(1768678477), to_timestamp(1768678477), NULL),
(10, 'https://github.com/modelcontextprotocol/ext-apps', 'GitHub - modelcontextprotocol/ext-apps: Official repo for SDK of upcoming Apps / UI extension', 'Official repo for SDK of upcoming Apps / UI extension - modelcontextprotocol/ext-apps', 'other', 'to_learn', 9, NULL, NULL, to_timestamp(1768678934), to_timestamp(1768678934), NULL),
(11, 'https://x.com/gregisenberg/status/2009332316120993803', 'Greg Isenberg on X', 'Tweet from Greg Isenberg', 'other', 'to_learn', 10, NULL, NULL, to_timestamp(1768828181), to_timestamp(1768828181), NULL),
(12, 'https://open.spotify.com/episode/45bpbNSkbyvDKItIXiKUg0', 'Ralph Wiggum goes to Gas Town and the death of the IC - Dev Interrupted', 'In this episode, Andrew and Ben dive into the viral "Ralph Loop" phenomenon and discuss how simple bash loops and deterministic context allocation are changing the unit economics of code. They also explore Steve Yegge''s "Gas Town" concept for orchestrating AI agents.', 'podcast', 'to_learn', 11, NULL, NULL, to_timestamp(1768828181), to_timestamp(1768828181), NULL),
(13, 'https://x.com/_investinq/status/2012710917218144321', '_investinq on X', 'Tweet from _investinq', 'other', 'to_learn', 12, NULL, NULL, to_timestamp(1768828181), to_timestamp(1768828181), NULL),
(14, 'https://engineering.block.xyz/blog/ai-assisted-development-at-block', 'AI-Assisted Development at Block', 'Inside Block''s approach to AI-assisted development, from repo readiness to multi-agent workflows.', 'blog', 'completed', 13, NULL, NULL, to_timestamp(1768828181), to_timestamp(1768943527), to_timestamp(1768943527)),
(15, 'https://www.jovweb.dev/blog/claude-code-mastery-01-getting-started', 'Claude Code Mastery Part 1: Getting Started', 'Get Claude Code installed and running your first commands in under 15 minutes. Learn installation, authentication, essential commands, and the mindset shift that makes AI-assisted coding actually work.', 'blog', 'to_learn', 14, NULL, NULL, to_timestamp(1768828181), to_timestamp(1768828181), NULL);

-- Step 3: Insert your existing content ideas
-- =====================================================

INSERT INTO content_ideas (id, title, description, type, status, linked_resource_ids, notes, created_at, updated_at) VALUES
(1, 'Write a beginner''s guide to LLMs', NULL, 'blog_post', 'idea', NULL, NULL, to_timestamp(1768677714), to_timestamp(1768677714)),
(2, 'YouTube video: GPT-4 explained simply', NULL, 'video', 'idea', NULL, NULL, to_timestamp(1768677761), to_timestamp(1768677761));

-- Step 4: Reset sequences to continue from max ID
-- =====================================================

SELECT setval('resources_id_seq', (SELECT MAX(id) FROM resources));
SELECT setval('content_ideas_id_seq', (SELECT MAX(id) FROM content_ideas));

-- =====================================================
-- DONE! Your data has been migrated.
-- =====================================================
