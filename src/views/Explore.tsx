'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import { useBookmarks, useSolved } from '@/hooks/useStore';
import { questions } from '@/lib/mockData';
import { QuestionCardSkeleton } from '@/components/Skeleton';

const topics = [...new Set(questions.flatMap((q) => q.topics))].sort();
const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
const PAGE_SIZE = 10;

function statusColor(s: string) {
  switch (s) {
    case 'beginner': return 'border-[#3fb950] text-[#3fb950]';
    case 'intermediate': return 'border-[#d29922] text-[#d29922]';
    case 'advanced': return 'border-[#f85149] text-[#f85149]';
    default: return 'border-[var(--border-color)] text-[var(--text-secondary)]';
  }
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [activeDifficulties, setActiveDifficulties] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookmarks] = useBookmarks();
  const [solved] = useSolved();

  const filtered = useMemo(() => {
    let list = questions;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (qst) =>
          qst.title.toLowerCase().includes(q) ||
          qst.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (activeTopics.length) {
      list = list.filter((qst) => qst.topics.some((t) => activeTopics.includes(t)));
    }
    if (activeDifficulties.length) {
      list = list.filter((qst) => activeDifficulties.includes(qst.difficulty));
    }
    if (showBookmarked) {
      list = list.filter((qst) => bookmarks.some((b) => b.slug === qst.slug));
    }
    return list;
  }, [search, activeTopics, activeDifficulties, showBookmarked, bookmarks]);

  const paginated = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const toggleTopic = (t: string) => {
    setActiveTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    setPage(0);
  };

  const toggleDifficulty = (d: string) => {
    setActiveDifficulties((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        placeholder="Search challenges..."
        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#58a6ff]"
        autoFocus
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowBookmarked(!showBookmarked)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            showBookmarked
              ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]'
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
          }`}
        >
          ★ Bookmarked
        </button>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => toggleTopic(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              activeTopics.includes(t)
                ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => toggleDifficulty(d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              activeDifficulties.includes(d)
                ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-[var(--text-secondary)]">
        {filtered.length} question{filtered.length !== 1 && 's'}
      </p>

      {/* Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <QuestionCardSkeleton key={i} />)
          ) : (
            paginated.map((qst, i) => {
              const isSolved = solved.some((s) => s.slug === qst.slug);
              const isBm = bookmarks.some((b) => b.slug === qst.slug);
              return (
                <motion.div
                  key={qst.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 transition hover:border-[#58a6ff]"
                  onClick={() => navigate(`question/${qst.slug}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{qst.title}</h3>
                        {isSolved && <span className="text-xs text-[#3fb950]">✓ Solved</span>}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {qst.topics.slice(0, 3).map((t) => (
                          <span key={t} className="rounded bg-[var(--hover-bg)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${statusColor(qst.difficulty)}`}>
                        {qst.difficulty}
                      </span>
                      <span className="text-xs font-semibold text-[#3fb950]">+{qst.xp_reward} XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => { setPage((p) => p + 1); setLoading(false); }, 200);
            }}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--hover-bg)]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
