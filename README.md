# 🧠 AI Learning Hub

A beautiful, personal learning management app for organizing AI-related resources with a todo-style workflow.

![AI Learning Hub Screenshot](./screenshots/main.png)

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
# Leave empty for development (no password required)
# Set a strong password for production
APP_PASSWORD=your-secure-password

# Session secret for cookie signing
SESSION_SECRET=your-random-secret-key
```

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
