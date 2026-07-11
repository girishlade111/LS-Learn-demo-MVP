// ─── User ───────────────────────────────────────────────
export interface UserProfile {
  username: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

export interface SolvedQuestion {
  slug: string;
  answered_at: string;
  correct: boolean;
  time_spent: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  question_slugs: string[];
  created_at: string;
}

export interface BookmarkedQuestion {
  slug: string;
  bookmarked_at: string;
  tags: string[];
}

export interface Note {
  slug: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UserReferral {
  code: string;
  claimed_by_me: boolean;
  successful_invites: string[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  timer_enabled: boolean;
  timer_duration: number;
}

export interface UserState {
  profile: UserProfile;
  xp: number;
  streak: number;
  solved: SolvedQuestion[];
  bookmarks: BookmarkedQuestion[];
  notes: Note[];
  collections: Collection[];
  settings: UserSettings;
  onboarding_completed: boolean;
  referral: UserReferral;
  heatmap_data: HeatmapDay[];
  live_solves: LiveSolve[];
}

// ─── Question ───────────────────────────────────────────
export interface MediaItem {
  type: 'image' | 'video' | 'audio';
  src: string;
  caption?: string;
}

export interface MCQChoice {
  id: string;
  text: string;
}

export interface MCQQuestion {
  format: 'mcq';
  choices: MCQChoice[];
  correct_choice_id: string;
}

export interface TheoryQuestion {
  format: 'theory';
  expected_keywords: string[];
}

export interface CodeSnippetQuestion {
  format: 'code-snippet';
  language: string;
  initial_code: string;
  expected_output: string;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  hint: string;
}

export interface ProjectQuestion {
  format: 'project';
  steps: ProjectStep[];
}

export type QuestionFormat = MCQQuestion | TheoryQuestion | CodeSnippetQuestion | ProjectQuestion;

export interface Question {
  slug: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  xp_reward: number;
  format_data: QuestionFormat;
  media: MediaItem[];
  created_at: string;
}

// ─── Misc ───────────────────────────────────────────────
export interface HeatmapDay {
  date: string;
  count: number;
}

export interface LiveSolve {
  username: string;
  display_name: string;
  avatar_url: string;
  question_title: string;
  question_slug: string;
  xp_awarded: number;
  solved_at: string;
}

export interface Notification {
  id: string;
  type: 'xp' | 'streak' | 'badge' | 'referral' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface OnboardingData {
  step: number;
  username: string;
  display_name: string;
  skill_level: string;
  goal: string;
}

export type GoalOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type SkillOption = {
  id: string;
  label: string;
  level: 'beginner' | 'intermediate' | 'advanced';
};
