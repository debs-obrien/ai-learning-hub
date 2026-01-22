# 🧠 AI Learning Hub

A beautiful, personal learning management app for organizing AI-related resources with a todo-style workflow.

> **Built with [goose](https://github.com/block/goose) in under 30 minutes from a single prompt!** 🪿✨

## ✨ Features

### 📚 Resource Management
- **Add URLs** with automatic metadata fetching (title, description, favicon)
- **Smart categorization**: Blog, Video, Podcast, Course, Paper, Other
- **Drag & drop** to reorder priorities
- **Rich notes** for each resource

### 📋 Learning Workflow
- **Queue** → **Learning** → **Completed** status flow
- Visual indicators for each status (color-coded borders)
- Easy status transitions via dropdown menu

### 💡 Content Ideas
- Track content creation ideas inspired by your learning
- Multiple types: Blog Post, Video, Tutorial, Thread
- Status workflow: Idea → Drafting → Published

### 🔍 Search & Filter
- Full-text search across titles, descriptions, and notes
- Filter by category
- View all or filter by status

### 🔐 Password Protection
- Simple password authentication for deployment
- Session-based security

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-learning-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# Supabase connection
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key

# App password for authentication
APP_PASSWORD=your-secure-password

# Session secret for cookie signing
SESSION_SECRET=your-random-secret-key
```

## 🧪 Testing

This project uses Playwright for E2E testing with a separate test database.

### Test Environment Setup

1. Create a `.env.test.local` file with your **test database** credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-test-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-test-supabase-key
APP_PASSWORD=your-test-password
SESSION_SECRET=your-test-secret
```

2. Seed the test database with sample data:

```bash
npm run seed:test
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/seed.spec.ts
```

### Development with Test Data

Run the app with the test database for design/development purposes:

```bash
npm run dev:test
```

This starts the app on port 3001 using the test database, so you can work with sample data without affecting production.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 with production database |
| `npm run dev:test` | Start dev server on port 3001 with test database |
| `npm run seed:test` | Seed test database with sample resources and ideas |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |

## 🌐 Deployment to Netlify

1. Push your code to GitHub

2. Connect your repo to Netlify

3. Set environment variables in Netlify dashboard:
   - `APP_PASSWORD`: Your chosen password
   - `SESSION_SECRET`: A random string for session security

4. Deploy! Netlify will automatically build and deploy

### Build Command
```bash
npm run build
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite with Drizzle ORM
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Deployment**: Netlify

## 📁 Project Structure

```
ai-learning-hub/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── login/        # Login page
│   │   └── page.tsx      # Main dashboard
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Dashboard.tsx
│   │   ├── ResourceCard.tsx
│   │   ├── AddResourceModal.tsx
│   │   ├── NotesModal.tsx
│   │   └── ContentIdeas.tsx
│   └── lib/
│       ├── auth/         # Authentication
│       └── db/           # Database setup & schema
├── data/                 # SQLite database (gitignored)
└── netlify.toml          # Netlify configuration
```

## 📝 Usage Tips

1. **Adding Resources**: Click "+ Add URL", paste a link, and the sparkle button will auto-fetch metadata
2. **Prioritizing**: Drag cards up/down to reorder your learning queue
3. **Taking Notes**: Click the menu (⋮) on any card → "Add Notes"
4. **Tracking Progress**: Move items through Queue → Learning → Done
5. **Content Ideas**: Use the sidebar to track content you want to create

## 🎨 Customization

### Adding New Categories
Edit `src/lib/db/schema.ts` to add new resource categories.

### Changing Colors
Modify the Tailwind classes in component files or update `globals.css`.

## 📄 License

MIT License - feel free to use this for your own learning journey!

---

Built with 💜 for AI learners everywhere
