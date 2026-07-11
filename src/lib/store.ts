import { defaultUserState } from './mockData';
import type { UserState, UserProfile, SolvedQuestion, Collection, Note, BookmarkedQuestion } from '@/types';

function getState(): UserState {
  if (typeof window === 'undefined') return defaultUserState;
  try {
    const raw = localStorage.getItem('ls-learn-state');
    if (!raw) return defaultUserState;
    return JSON.parse(raw) as UserState;
  } catch {
    return defaultUserState;
  }
}

function saveState(state: UserState) {
  try {
    localStorage.setItem('ls-learn-state', JSON.stringify(state));
  } catch { /* quota exceeded */ }
}

export function initState(): UserState {
  const state = { ...defaultUserState, ...getState() };
  saveState(state);
  return state;
}

export function getProfile(): UserProfile {
  return getState().profile;
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const s = getState();
  s.profile = { ...s.profile, ...updates };
  saveState(s);
  return s.profile;
}

export function getXp(): number {
  return getState().xp;
}

export function addXp(amount: number): number {
  const s = getState();
  s.xp += amount;
  saveState(s);
  return s.xp;
}

export function getStreak(): number {
  return getState().streak;
}

export function updateStreak(s: number): void {
  const state = getState();
  state.streak = s;
  saveState(state);
}

export function getSolved(): SolvedQuestion[] {
  return getState().solved;
}

export function addSolved(solved: SolvedQuestion): SolvedQuestion[] {
  const s = getState();
  s.solved.unshift(solved);
  saveState(s);
  return s.solved;
}

export function getBookmarks(): BookmarkedQuestion[] {
  return getState().bookmarks;
}

export function toggleBookmark(slug: string, tags: string[] = []): BookmarkedQuestion[] {
  const s = getState();
  const idx = s.bookmarks.findIndex((b) => b.slug === slug);
  if (idx >= 0) {
    s.bookmarks.splice(idx, 1);
  } else {
    s.bookmarks.unshift({ slug, bookmarked_at: new Date().toISOString(), tags });
  }
  saveState(s);
  return s.bookmarks;
}

export function isBookmarked(slug: string): boolean {
  return getState().bookmarks.some((b) => b.slug === slug);
}

export function getNotes(): Note[] {
  return getState().notes;
}

export function upsertNote(slug: string, content: string): Note[] {
  const s = getState();
  const existing = s.notes.find((n) => n.slug === slug);
  const now = new Date().toISOString();
  if (existing) {
    existing.content = content;
    existing.updated_at = now;
  } else {
    s.notes.push({ slug, content, created_at: now, updated_at: now });
  }
  saveState(s);
  return s.notes;
}

export function deleteNote(slug: string): Note[] {
  const s = getState();
  s.notes = s.notes.filter((n) => n.slug !== slug);
  saveState(s);
  return s.notes;
}

export function getNote(slug: string): Note | undefined {
  return getState().notes.find((n) => n.slug === slug);
}

export function getCollections(): Collection[] {
  return getState().collections;
}

export function createCollection(name: string, description: string): Collection[] {
  const s = getState();
  const c: Collection = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name,
    description,
    question_slugs: [],
    created_at: new Date().toISOString(),
  };
  s.collections.push(c);
  saveState(s);
  return s.collections;
}

export function deleteCollection(id: string): Collection[] {
  const s = getState();
  s.collections = s.collections.filter((c) => c.id !== id);
  saveState(s);
  return s.collections;
}

export function addToCollection(collectionId: string, slug: string): Collection[] {
  const s = getState();
  const c = s.collections.find((col) => col.id === collectionId);
  if (c && !c.question_slugs.includes(slug)) {
    c.question_slugs.push(slug);
  }
  saveState(s);
  return s.collections;
}

export function removeFromCollection(collectionId: string, slug: string): Collection[] {
  const s = getState();
  const c = s.collections.find((col) => col.id === collectionId);
  if (c) {
    c.question_slugs = c.question_slugs.filter((q) => q !== slug);
  }
  saveState(s);
  return s.collections;
}

export function getSettings() {
  return getState().settings;
}

export function updateSettings(updates: Partial<UserState['settings']>) {
  const s = getState();
  s.settings = { ...s.settings, ...updates };
  saveState(s);
  return s.settings;
}

export function getReferral() {
  return getState().referral;
}

export function claimReferral(code: string): boolean {
  const s = getState();
  if (s.referral.claimed_by_me) return false;
  s.referral.claimed_by_me = true;
  s.xp += 50;
  saveState(s);
  return true;
}

export function addSuccessfulInvite(username: string) {
  const s = getState();
  if (!s.referral.successful_invites.includes(username)) {
    s.referral.successful_invites.push(username);
  }
  saveState(s);
}

export function setOnboardingComplete(): void {
  const s = getState();
  s.onboarding_completed = true;
  saveState(s);
}

export function isOnboardingComplete(): boolean {
  return getState().onboarding_completed;
}

export function getHeatmap() {
  return getState().heatmap_data;
}

export function getLiveSolves() {
  return getState().live_solves;
}

export function resetState(): void {
  localStorage.removeItem('ls-learn-state');
}
