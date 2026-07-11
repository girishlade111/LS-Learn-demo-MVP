'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUser, useXp, useStreak, useSolved, useBookmarks, useNotes, useCollections, useHeatmap, useReferral } from '@/hooks/useStore';
import { questions } from '@/lib/mockData';
import HeatmapGrid from '@/components/HeatmapGrid';
import { navigate } from '@/lib/navigate';
import { ConfettiCannon } from '@/components/Confetti';

export default function ProfileView() {
  const user = useUser();
  const [xp] = useXp();
  const [streak] = useStreak();
  const [solved] = useSolved();
  const [bookmarks] = useBookmarks();
  const [notes, upsertNote, deleteNote] = useNotes();
  const cols = useCollections();
  const heatmap = useHeatmap();
  const [referral] = useReferral();

  const [tab, setTab] = useState<'bookmarks' | 'collections' | 'notes'>('bookmarks');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const bookmarkedQuestions = useMemo(
    () => questions.filter((q) => bookmarks.some((b) => b.slug === q.slug)),
    [bookmarks],
  );

  const filteredNotes = useMemo(
    () => (search ? notes.filter((n) => n.content.toLowerCase().includes(search.toLowerCase())) : notes),
    [notes, search],
  );

  const solvedQuestions = useMemo(
    () => questions.filter((q) => solved.some((s) => s.slug === q.slug)),
    [solved],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--card-bg)] text-2xl font-bold text-[#58a6ff] ring-2 ring-[var(--border-color)]">
          {user.display_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user.display_name}</h1>
          <p className="text-sm text-[var(--text-secondary)]">@{user.username}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span><strong className="text-[var(--text-primary)]">{xp}</strong> XP</span>
            <span><strong className="text-[var(--text-primary)]">{streak}</strong> day streak</span>
            <span><strong className="text-[var(--text-primary)]">{solved.length}</strong> solved</span>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Referral code</div>
            <div className="text-sm font-mono font-bold text-[#58a6ff]">{referral.code}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--text-secondary)]">Invites</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">{referral.successful_invites.length}</div>
          </div>
        </div>
      </div>

      {/* Activity heatmap */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Activity</h2>
        <HeatmapGrid data={heatmap} />
      </div>

      {/* Tabs */}
      <div>
        <div className="mb-4 flex gap-2 border-b border-[var(--border-color)] pb-2">
          {(['bookmarks', 'collections', 'notes'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? 'border-b-2 border-[#58a6ff] text-[#58a6ff]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t} ({t === 'bookmarks' ? bookmarks.length : t === 'collections' ? cols.collections.length : notes.length})
            </button>
          ))}
        </div>

        {/* Search for bookmarks/notes */}
        {(tab === 'bookmarks' || tab === 'notes') && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="mb-4 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[#58a6ff]"
          />
        )}

        {/* Bookmarks tab */}
        {tab === 'bookmarks' && (
          <div className="space-y-2">
            {bookmarkedQuestions.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)]">No bookmarks yet.</p>
            )}
            {bookmarkedQuestions.map((q) => (
              <button
                key={q.slug}
                onClick={() => navigate(`question/${q.slug}`)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-left transition hover:border-[#58a6ff]"
              >
                <div className="text-sm font-medium text-[var(--text-primary)]">{q.title}</div>
                <div className="text-xs text-[var(--text-secondary)]">{q.difficulty} · +{q.xp_reward} XP</div>
              </button>
            ))}
          </div>
        )}

        {/* Collections tab */}
        {tab === 'collections' && (
          <div className="space-y-3">
            {cols.collections.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)]">No collections yet.</p>
            )}
            {cols.collections.map((c) => (
              <div key={c.id} className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{c.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{c.description}</div>
                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{c.question_slugs.length} questions</div>
                  </div>
                  <button
                    onClick={() => cols.delete(c.id)}
                    className="text-xs text-[#f85149] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes tab */}
        {tab === 'notes' && (
          <div className="space-y-3">
            {filteredNotes.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)]">{search ? 'No matching notes.' : 'No notes yet.'}</p>
            )}
            {filteredNotes.map((n) => {
              const q = questions.find((q) => q.slug === n.slug);
              return (
                <div key={n.slug} className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-primary)]">
                      {q?.title || n.slug}
                    </span>
                    <div className="flex gap-2">
                      {editingNote === n.slug ? (
                        <button
                          onClick={() => {
                            upsertNote(n.slug, editContent);
                            setEditingNote(null);
                          }}
                          className="text-xs text-[#3fb950] hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNote(n.slug);
                            setEditContent(n.content);
                          }}
                          className="text-xs text-[#58a6ff] hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteNote(n.slug)}
                        className="text-xs text-[#f85149] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {editingNote === n.slug ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] w-full resize-y rounded border border-[var(--border-color)] bg-[var(--bg-primary)] p-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#58a6ff]"
                    />
                  ) : (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3">{n.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
