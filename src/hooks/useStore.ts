'use client';

import { useState, useCallback, useEffect } from 'react';
import * as store from '@/lib/store';
import type {
  UserProfile,
  SolvedQuestion,
  BookmarkedQuestion,
  Note,
  Collection,
  UserSettings,
  UserReferral,
  HeatmapDay,
  LiveSolve,
} from '@/types';
import { questions } from '@/lib/mockData';

let globalVersion = 0;
function bump() { globalVersion++; }

export function useStoreVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      if (globalVersion !== v) setV(globalVersion);
    }, 100);
    return () => clearInterval(iv);
  }, [v]);
  return v;
}

export function useUser(): UserProfile {
  useStoreVersion();
  return store.getProfile();
}

export function useUpdateProfile() {
  return useCallback((updates: Partial<UserProfile>) => {
    const r = store.updateProfile(updates);
    bump();
    return r;
  }, []);
}

export function useXp(): [number, (a: number) => number] {
  const [xp, setXp] = useState(0);
  useStoreVersion();
  useEffect(() => { setXp(store.getXp()); }, []);
  const add = useCallback((a: number) => {
    const r = store.addXp(a);
    bump();
    setXp(r);
    return r;
  }, []);
  return [xp, add];
}

export function useStreak(): [number, (s: number) => void] {
  const [streak, setStreak] = useState(0);
  useStoreVersion();
  useEffect(() => { setStreak(store.getStreak()); }, []);
  const update = useCallback((s: number) => {
    store.updateStreak(s);
    bump();
    setStreak(s);
  }, []);
  return [streak, update];
}

export function useSolved(): [SolvedQuestion[], (sq: SolvedQuestion) => SolvedQuestion[]] {
  const [solved, setSolved] = useState<SolvedQuestion[]>([]);
  useStoreVersion();
  useEffect(() => { setSolved(store.getSolved()); }, []);
  const add = useCallback((sq: SolvedQuestion) => {
    const r = store.addSolved(sq);
    bump();
    setSolved([...r]);
    return r;
  }, []);
  return [solved, add];
}

export function useBookmarks(): [BookmarkedQuestion[], (slug: string, tags?: string[]) => BookmarkedQuestion[]] {
  const [b, setB] = useState<BookmarkedQuestion[]>([]);
  useStoreVersion();
  useEffect(() => { setB(store.getBookmarks()); }, []);
  const toggle = useCallback((slug: string, tags?: string[]) => {
    const r = store.toggleBookmark(slug, tags);
    bump();
    setB([...r]);
    return r;
  }, []);
  return [b, toggle];
}

export function useIsBookmarked(slug: string): boolean {
  useStoreVersion();
  return store.isBookmarked(slug);
}

export function useNotes(): [Note[], (slug: string, content: string) => Note[], (slug: string) => Note[]] {
  const [n, setN] = useState<Note[]>([]);
  useStoreVersion();
  useEffect(() => { setN(store.getNotes()); }, []);
  const upsert = useCallback((slug: string, content: string) => {
    const r = store.upsertNote(slug, content);
    bump();
    setN([...r]);
    return r;
  }, []);
  const del = useCallback((slug: string) => {
    const r = store.deleteNote(slug);
    bump();
    setN([...r]);
    return r;
  }, []);
  return [n, upsert, del];
}

export function useNote(slug: string): [Note | undefined, (c: string) => void] {
  const [note, setNote] = useState<Note | undefined>();
  useStoreVersion();
  useEffect(() => { setNote(store.getNote(slug)); }, [slug]);
  const save = useCallback((content: string) => {
    store.upsertNote(slug, content);
    bump();
    setNote(store.getNote(slug));
  }, [slug]);
  return [note, save];
}

export function useCollections() {
  const [cols, setCols] = useState<Collection[]>([]);
  useStoreVersion();
  useEffect(() => { setCols(store.getCollections()); }, []);
  return {
    collections: cols,
    create: useCallback((name: string, desc: string) => {
      const r = store.createCollection(name, desc);
      bump();
      setCols([...r]);
    }, []),
    delete: useCallback((id: string) => {
      const r = store.deleteCollection(id);
      bump();
      setCols([...r]);
    }, []),
    addTo: useCallback((id: string, slug: string) => {
      const r = store.addToCollection(id, slug);
      bump();
      setCols([...r]);
    }, []),
    removeFrom: useCallback((id: string, slug: string) => {
      const r = store.removeFromCollection(id, slug);
      bump();
      setCols([...r]);
    }, []),
  };
}

export function useSettings(): [UserSettings, (u: Partial<UserSettings>) => UserSettings] {
  const [s, setS] = useState<UserSettings>(store.getSettings());
  useStoreVersion();
  useEffect(() => { setS(store.getSettings()); }, []);
  const update = useCallback((u: Partial<UserSettings>) => {
    const r = store.updateSettings(u);
    bump();
    setS({ ...r });
    return r;
  }, []);
  return [s, update];
}

export function useReferral(): [UserReferral, () => void] {
  const [r, setR] = useState<UserReferral>(store.getReferral());
  useStoreVersion();
  useEffect(() => { setR(store.getReferral()); }, []);
  const claim = useCallback(() => {
    store.claimReferral(r.code);
    bump();
    setR(store.getReferral());
  }, [r.code]);
  return [r, claim];
}

export function useOnboarding(): [boolean, () => void] {
  const [done, setDone] = useState(false);
  useStoreVersion();
  useEffect(() => { setDone(store.isOnboardingComplete()); }, []);
  const complete = useCallback(() => {
    store.setOnboardingComplete();
    bump();
    setDone(true);
  }, []);
  return [done, complete];
}

export function useHeatmap(): HeatmapDay[] {
  useStoreVersion();
  return store.getHeatmap();
}

export function useLiveSolves(): LiveSolve[] {
  useStoreVersion();
  return store.getLiveSolves();
}

export function useQuestion(slug: string) {
  return questions.find((q) => q.slug === slug) || null;
}
