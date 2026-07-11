# LS Learn — Level Up Your Developer Skills Daily, Free

**LS Learn** is a full-stack developer skill-building platform with daily challenges across JavaScript, TypeScript, React, Python, DevOps, CSS, SQL, and System Design. Solve questions in four formats (MCQ, Theory, Code Snippets, Projects), earn XP, maintain streaks, and track your progress — all in a gamified, single-page application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router) |
| **UI Library** | React 19.2.4 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4.x |
| **Animation** | Framer Motion 12.42.0 |
| **Icons** | Lucide React + React Icons |
| **State** | Custom polling-based store with localStorage persistence |
| **Routing** | Hash-based client-side SPA routing |
| **Fonts** | Geist (via `next/font/google`) |
| **Linting** | ESLint 9.x (`eslint-config-next`) |

## Features

### 🎯 Multi-Format Challenges
Four distinct question types modeled as a TypeScript discriminated union:
- **MCQ** — Multiple choice with single correct answer
- **Theory** — Free-text conceptual questions with optional answer key comparison
- **Code Snippet** — Write or complete code in a textarea workspace
- **Project** — Multi-step guided projects with step-by-step tracking

### ⚡ Gamification System
- **XP Rewards** — Earn XP per correct solve (`reward + streak bonus +5`)
- **Streaks** — Consecutive daily solves with streak counter
- **Confetti & Animations** — Canvas-confetti burst + floating `+XP` notification on correct answers
- **Activity Heatmap** — GitHub-style 84-day contribution grid

### 📚 Personal Knowledge Management
- **Bookmarks** — Save questions for later with toggle from any view
- **Notes** — Per-question notes with auto-save (600ms debounce) from the solver workspace
- **Collections** — Create, name, and organize custom collections of questions

### 👤 User Profile
- Custom username, display name, skill level, and goals (from onboarding)
- Stats: Total XP, Day Streak, Questions Solved
- Activity heatmap
- Three-tab interface: Bookmarks, Collections, Notes (with inline search & edit)

### 🔗 Referral System
- Unique referral code per user (auto-generated during onboarding)
- Shareable referral claim page at `/#/join/:code`
- 50 XP awarded on successful referral claim

### 🧭 Navigate & Explore
- **Dashboard** — Overview with stat cards, daily challenge, resume progress, AI Coach sandbox, referral panel, activity heatmap, live community solves feed
- **Explore** — Search and filter challenges by topic, difficulty, and bookmarked status with paginated cards ("Load More")
- **Workspace Solver** — Two-column layout with question details, timer (configurable, default 15 min), format-specific input, submit feedback, and notes panel

### 🎨 Theming
- Dark mode (default) with `.light` class toggle
- CSS custom properties for semantic colors (`--bg-primary`, `--text-primary`, `--color-accent-green`, etc.)
- Persistent theme selection via `localStorage`
- Aurora animated hero background (pure CSS — no JS needed)

### 📱 Responsive Design
- Mobile-first with Tailwind responsive prefixes (`sm:`, `lg:`)
- Multi-column layouts collapse to single column on small screens
- Adaptive navbar with link visibility

## Project Structure

```
ls-learn/
├── public/                       # Static assets (SVG icons)
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout (fonts, metadata, ClientLayout)
│   │   ├── page.tsx              # Entry — renders <HashRouter />
│   │   ├── globals.css           # Tailwind v4 + theme variables + animations
│   │   ├── dashboard/page.tsx    # Redirects to /#/dashboard
│   │   ├── explore/page.tsx      # Redirects to /#/explore
│   │   ├── onboarding/page.tsx   # Redirects to /#/onboarding
│   │   ├── question/[slug]/page.tsx  # Redirects to /#/question/:slug
│   │   └── profile/[username]/page.tsx # Redirects to /#/profile/:username
│   ├── components/               # Reusable UI components
│   │   ├── ClientLayout.tsx      # Theme provider + Navbar wrapper
│   │   ├── Navbar.tsx            # Sticky top nav (logo, links, streak, XP, theme toggle, notifications, avatar)
│   │   ├── HashRouter.tsx        # Core SPA router (parses hash, lazy-loads views, page transitions)
│   │   ├── XpFloat.tsx           # Animated "+XP" notification (auto-dismiss 1.2s)
│   │   ├── LiveFeed.tsx          # Real-time community solves feed (AnimatePresence)
│   │   ├── HeatmapGrid.tsx       # GitHub-style 84-day contribution heatmap
│   │   ├── Confetti.tsx          # Canvas-confetti burst on correct solve
│   │   ├── Skeleton.tsx          # Loading placeholders (Card, QuestionCard, Dashboard)
│   │   ├── Timer.tsx             # Countdown timer with pause, warning (<30s), expired states
│   │   └── ui/
│   │       └── aurora-section-hero.tsx  # Animated CSS Aurora background (60 light beams)
│   ├── views/                    # Page-level SPA views
│   │   ├── LandingPage.tsx       # Marketing page (hero, trust bar, features, how-it-works, stats, CTA, footer)
│   │   ├── OnboardingFlow.tsx    # 3-step wizard (username → skill level → goals)
│   │   ├── Dashboard.tsx         # Main dashboard with stats, heatmap, referrals, live feed
│   │   ├── Explore.tsx           # Question browser with search, filter, pagination
│   │   ├── WorkspaceSolver.tsx   # Question-solving workspace (all 4 formats)
│   │   ├── ProfileView.tsx       # User profile with bookmarks/collections/notes tabs
│   │   └── ReferralClaim.tsx     # Referral code claim page
│   ├── hooks/
│   │   ├── useTheme.tsx          # Theme context provider + toggle
│   │   └── useStore.ts           # 15 reactive hooks over localStorage state (user, XP, streak, solved, bookmarks, notes, collections, settings, referral, onboarding, heatmap, live solves, questions)
│   ├── lib/
│   │   ├── store.ts              # Client-side state CRUD (localStorage JSON, version-bump polling)
│   │   ├── navigate.ts           # SPA hash navigation utility
│   │   └── mockData.ts           # Full mock dataset (user state, 40+ questions, notifications, heatmap, live solves)
│   └── types/
│       └── index.ts              # TypeScript types (User, Question, Solved, Heatmap, Collection, Note, etc.)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration (strict, @/ alias)
├── postcss.config.mjs            # Tailwind CSS v4 PostCSS plugin
├── eslint.config.mjs             # ESLint flat config
└── package.json                  # Dependencies and scripts
```

## Routing Architecture

The app uses a **hybrid routing model**:
- **Next.js App Router** pages (`/explore`, `/dashboard`, `/onboarding`, `/question/[slug]`, `/profile/[username]`) exist for URL shareability but immediately redirect to hash-based routes.
- The actual SPA is driven by `HashRouter.tsx`, which parses `window.location.hash` and renders views with `React.lazy` + Framer Motion page transitions.

| Route | View |
|-------|------|
| `/#/` | LandingPage |
| `/#/onboarding` | OnboardingFlow |
| `/#/dashboard` | Dashboard |
| `/#/explore` | Explore |
| `/#/question/:slug` | WorkspaceSolver |
| `/#/profile` | ProfileView |
| `/#/join/:code` | ReferralClaim |

## State Management

A custom **polling-based store** on top of `localStorage`:
- All data persists as JSON under the `ls-learn-state` key.
- A global version counter (`_version`) is bumped on every mutation.
- `useStoreVersion()` polls the counter every 100ms and triggers React re-renders only when the version changes.
- Provides 15 typed hooks: `useUser`, `useXp`, `useStreak`, `useSolved`, `useBookmarks`, `useIsBookmarked`, `useNotes`, `useNote`, `useCollections`, `useSettings`, `useReferral`, `useOnboarding`, `useHeatmap`, `useLiveSolves`, `useQuestion`.

## Question Format System

All questions live in `mockData.ts` and use a **discriminated union** type:

```typescript
type QuestionFormat =
  | { format: "mcq"; choices: MCQChoice[] }
  | { format: "theory"; answer_key: string }
  | { format: "code_snippet"; language: string }
  | { format: "project"; steps: ProjectStep[] }
```

The `WorkspaceSolver` view renders different UI based on `qst.format_data.format`.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

The app is fully client-side — no backend or API keys required. All data is pre-seeded with mock data (user "Girish", 1240 XP, 40+ questions). State resets on `localStorage.clear()`.

## Deployment

The app deploys seamlessly to **Vercel** (or any Node.js/Next.js host):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

## License

MIT
