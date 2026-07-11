'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import { useQuestion, useXp, useSolved, useStreak, useBookmarks, useNote, useSettings } from '@/hooks/useStore';
import { questions } from '@/lib/mockData';
import Timer from '@/components/Timer';
import { ConfettiCannon } from '@/components/Confetti';
import { XpFloat } from '@/components/XpFloat';
import { QuestionCardSkeleton } from '@/components/Skeleton';

interface Props {
  slug: string;
}

export default function WorkspaceSolver({ slug }: Props) {
  const qst = useQuestion(slug);
  const [xp, addXp] = useXp();
  const [solved, addSolved] = useSolved();
  const [streak, updateStreak] = useStreak();
  const [, toggleBookmark] = useBookmarks();
  const [settings] = useSettings();
  const [note, saveNote] = useNote(slug);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [theoryAnswer, setTheoryAnswer] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [projectStep, setProjectStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note?.content || '');
  const [loading, setLoading] = useState(true);

  const noteTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!qst) { setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(t);
  }, [qst]);

  useEffect(() => {
    setSelectedChoice(null);
    setTheoryAnswer('');
    setCodeSnippet(qst?.format_data.format === 'code-snippet' ? (qst.format_data as any).initial_code || '' : '');
    setProjectStep(0);
    setSubmitted(false);
    setCorrect(null);
    setShowConfetti(false);
    setXpGained(0);
    setNoteDraft(note?.content || '');
  }, [slug, qst, note]);

  // Debounced note save
  const debouncedSave = useCallback(
    (val: string) => {
      clearTimeout(noteTimer.current);
      noteTimer.current = setTimeout(() => saveNote(val), 600);
    },
    [saveNote],
  );

  const handleNoteChange = (val: string) => {
    setNoteDraft(val);
    debouncedSave(val);
  };

  const handleSubmit = () => {
    if (submitted) return;
    if (!qst) return;

    let isCorrect = false;
    const fd = qst.format_data;

    if (fd.format === 'mcq') {
      isCorrect = fd.correct_choice_id === selectedChoice;
    } else if (fd.format === 'theory') {
      const kws = fd.expected_keywords;
      isCorrect = kws.some((kw) => theoryAnswer.toLowerCase().includes(kw.toLowerCase()));
    } else if (fd.format === 'code-snippet') {
      isCorrect = codeSnippet.trim().toLowerCase() === fd.expected_output.trim().toLowerCase();
    } else if (fd.format === 'project') {
      isCorrect = projectStep >= fd.steps.length;
    }

    setSubmitted(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      const earned = qst.xp_reward + (streak > 0 ? 5 : 0);
      addXp(earned);
      setXpGained(earned);
      addSolved({ slug: qst.slug, answered_at: new Date().toISOString(), correct: true, time_spent: 0 });
      updateStreak(streak + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  // Redirect to explore if question doesn't exist
  useEffect(() => {
    if (!loading && !qst) navigate('explore');
  }, [loading, qst]);

  if (loading || !qst) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <QuestionCardSkeleton />
      </div>
    );
  }

  const fd = qst.format_data;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col gap-4 px-4 py-6 lg:flex-row">
      <AnimatePresence>{showConfetti && <ConfettiCannon />}</AnimatePresence>
      <AnimatePresence>{xpGained > 0 && <XpFloat amount={xpGained} />}</AnimatePresence>

      {/* Left: Question + optional code */}
      <motion.div
        layout
        className="flex-1 space-y-4"
      >
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          {/* Header */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${
              qst.difficulty === 'beginner' ? 'border-[#3fb950] text-[#3fb950]' :
              qst.difficulty === 'intermediate' ? 'border-[#d29922] text-[#d29922]' :
              'border-[#f85149] text-[#f85149]'
            }`}>
              {qst.difficulty}
            </span>
            <span className="text-xs font-semibold text-[#3fb950]">+{qst.xp_reward} XP</span>
            <span className="text-xs text-[var(--text-secondary)]">{qst.topics.join(', ')}</span>
            <button
              onClick={() => { toggleBookmark(slug); }}
              className="ml-auto text-sm text-[var(--text-secondary)] hover:text-[#58a6ff]"
            >
              ★
            </button>
          </div>

          <h1 className="text-lg font-bold text-[var(--text-primary)]">{qst.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{qst.description}</p>

          {/* Media */}
          {qst.media.length > 0 && (
            <div className="mt-4 space-y-2">
              {qst.media.map((m, i) => (
                <div key={i} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3">
                  {m.type === 'image' && <img src={m.src} alt={m.caption || ''} className="max-h-48 rounded object-contain" />}
                  {m.caption && <p className="mt-1 text-xs text-[var(--text-secondary)]">{m.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Code display (code-snippet / project) */}
        {(fd.format === 'code-snippet' || fd.format === 'project') && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
              {fd.format === 'code-snippet' ? 'Code' : 'Project Steps'}
            </h3>
            {fd.format === 'code-snippet' && (
              <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-xs text-[#c9d1d9]">
                <code>{fd.initial_code}</code>
              </pre>
            )}
            {fd.format === 'project' && (
              <div className="space-y-3">
                {fd.steps.map((s, i) => (
                  <div key={s.id} className={`rounded-lg border p-3 ${i === projectStep ? 'border-[#58a6ff] bg-[#58a6ff]/5' : 'border-[var(--border-color)]'}`}>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{i + 1}. {s.title}</div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{s.description}</p>
                    <p className="mt-1 text-xs italic text-[var(--text-secondary)]">Hint: {s.hint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Right: Interaction */}
      <motion.div
        layout
        className="w-full shrink-0 space-y-4 lg:w-[420px]"
      >
        {/* Floating Timer */}
        <div className="sticky top-20 z-10">
          {settings.timer_enabled && <Timer />}
        </div>

        {/* MCQ */}
        {fd.format === 'mcq' && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Choose your answer</h3>
            <div className="space-y-2">
              {fd.choices.map((c) => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedChoice(c.id)}
                  disabled={submitted}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                    submitted
                      ? c.id === fd.correct_choice_id
                        ? 'border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950]'
                        : c.id === selectedChoice
                          ? 'border-[#f85149] bg-[#f85149]/10 text-[#f85149]'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                      : c.id === selectedChoice
                        ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  {c.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Theory */}
        {fd.format === 'theory' && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Your explanation</h3>
            <textarea
              value={theoryAnswer}
              onChange={(e) => setTheoryAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Write your answer..."
              className="min-h-[140px] w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#58a6ff]"
            />
          </div>
        )}

        {/* Code snippet */}
        {fd.format === 'code-snippet' && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Your solution</h3>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              disabled={submitted}
              className="min-h-[160px] w-full resize-y rounded-lg border border-[var(--border-color)] bg-[#0d1117] p-3 font-mono text-sm text-[#c9d1d9] outline-none transition focus:border-[#58a6ff]"
            />
          </div>
        )}

        {/* Project */}
        {fd.format === 'project' && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Step {projectStep + 1} of {fd.steps.length}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{fd.steps[projectStep]?.description}</p>
            {projectStep < fd.steps.length - 1 && (
              <button
                onClick={() => setProjectStep((s) => s + 1)}
                disabled={submitted}
                className="mt-4 w-full rounded-lg bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2ea043] disabled:opacity-40"
              >
                Next Step
              </button>
            )}
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (fd.format === 'mcq' && !selectedChoice) ||
              (fd.format === 'theory' && !theoryAnswer.trim()) ||
              (fd.format === 'code-snippet' && !codeSnippet.trim()) ||
              (fd.format === 'project' && projectStep < fd.steps.length - 1)
            }
            className="w-full rounded-xl bg-[#238636] py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#2ea043] disabled:opacity-40"
          >
            Submit Answer
          </button>
        )}

        {/* Feedback */}
        {submitted && correct !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-5 text-center ${
              correct
                ? 'border-[#3fb950] bg-[#3fb950]/10'
                : 'border-[#f85149] bg-[#f85149]/10'
            }`}
          >
            <div className={`text-lg font-bold ${correct ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
              {correct ? 'Correct!' : 'Incorrect'}
            </div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">
              {correct ? `+${xpGained} XP earned` : 'Review and try again'}
            </div>
          </motion.div>
        )}

        {/* Notes panel (collapsible) */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
          <button
            onClick={() => setShowNotePanel(!showNotePanel)}
            className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-[var(--text-primary)]"
          >
            Notes
            <span className={`transition ${showNotePanel ? 'rotate-180' : ''}`}>▾</span>
          </button>
          <AnimatePresence>
            {showNotePanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[var(--border-color)] p-5">
                  <textarea
                    value={noteDraft}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Write your notes here... (auto-saved)"
                    className="min-h-[100px] w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#58a6ff]"
                  />
                  <p className="mt-1 text-right text-[10px] text-[var(--text-secondary)]">Auto-saved</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
