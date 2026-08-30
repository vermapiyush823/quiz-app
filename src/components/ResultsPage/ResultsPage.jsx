import { useState, useEffect, useRef } from 'react';
import styles from './ResultsPage.module.css';
import { useQuiz } from '../../context/QuizContext';
import { RESULT_CONFIG, formatTime } from '../../utils/constants';

export default function ResultsPage() {
  const { state, restartQuiz, startQuiz, goHome, goToHistory } = useQuiz();
  const { activeQuiz, answers, flags, quizStartTime, mode, isViewingPastResult, viewedResultDate } = state;
  const questions = activeQuiz?.questions || [];

  const [filter, setFilter] = useState('all'); // 'all' | 'incorrect' | 'correct' | 'flagged' | 'skipped'

  const correct = answers.filter(a => a?.isCorrect).length;
  const wrong   = answers.filter(a => a && !a.isCorrect && a.selectedIndices && a.selectedIndices.length > 0).length;
  const skipped = Math.max(0, questions.length - correct - wrong);
  const flagged = flags.filter(Boolean).length;
  const total   = questions.length;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
  const elapsed = Math.round((Date.now() - (quizStartTime || Date.now())) / 1000);

  const isPassed = pct >= 70;
  const result = RESULT_CONFIG.find(r => pct >= r.min) || RESULT_CONFIG[RESULT_CONFIG.length - 1];
  const ringColor = isPassed ? '#1db954' : '#e74c3c';

  const ringRef = useRef(null);
  const CIRC = 2 * Math.PI * 70;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = CIRC - (pct / 100) * CIRC;
      }
    });
  }, [pct, CIRC]);

  // Filter questions
  const filteredQuestions = questions.map((q, i) => ({ q, answer: answers[i], isFlagged: flags[i], index: i }))
    .filter(item => {
      if (filter === 'incorrect') return item.answer && !item.answer.isCorrect && item.answer.selectedIndices?.length > 0;
      if (filter === 'correct') return item.answer?.isCorrect;
      if (filter === 'flagged') return item.isFlagged;
      if (filter === 'skipped') return !item.answer || !item.answer.selectedIndices || item.answer.selectedIndices.length === 0;
      return true;
    });

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Saved History Notice Banner ───────────────────────── */}
      <div className={styles.historySavedBanner}>
        {isViewingPastResult ? (
          <>
            <span>📜 Viewing Past Exam Record from <strong>{formatDate(viewedResultDate)}</strong></span>
            <button className="btn btn-secondary btn-sm" onClick={goToHistory}>
              ← Back to My Progress
            </button>
          </>
        ) : (
          <>
            <span>💾 <strong>Exam Submitted &amp; Saved!</strong> You can revisit this score report anytime under <strong>My Progress</strong>.</span>
            <button className="btn btn-secondary btn-sm" onClick={goToHistory}>
              📊 View All Past Attempts
            </button>
          </>
        )}
      </div>

      {/* ── Top Header ────────────────────────────────────────── */}
      <div className={`${styles.header} animate-bounceIn`}>
        <div className={styles.passBadge} style={{ background: isPassed ? 'rgba(29, 185, 84, 0.15)' : 'rgba(231, 76, 60, 0.15)', color: isPassed ? '#1db954' : '#e74c3c' }}>
          {isPassed ? '🏆 PASSED (70%+ Requirement Met)' : '❌ NOT PASSED (70% Required)'}
        </div>
        <h1 className={styles.title}>{result.title}</h1>
        <p className={styles.subtitle}>{result.subtitle}</p>
        <span className={styles.modeTag}>
          {mode === 'exam' ? '⏱️ Real Exam Attempt' : '⚡ Practice Mode Session'} • {activeQuiz?.title}
        </span>
      </div>

      {/* ── Score Ring Card ───────────────────────────────────── */}
      <div className={`${styles.scoreCard} animate-fadeInUp`}>
        <div className={styles.ringTop} style={{ background: ringColor }} />

        <div className={styles.ringWrapper}>
          <svg className={styles.ring} viewBox="0 0 160 160" aria-label={`Score: ${pct}%`}>
            <circle className={styles.ringBg} cx="80" cy="80" r="70" />
            <circle
              ref={ringRef}
              className={styles.ringFill}
              cx="80" cy="80" r="70"
              style={{
                stroke: ringColor,
                strokeDasharray: CIRC,
                strokeDashoffset: CIRC,
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1) 0.2s',
              }}
            />
          </svg>
          <div className={styles.ringText}>
            <span className={styles.ringPct} style={{ color: ringColor }}>{pct}%</span>
            <span className={styles.ringLabel}>Score</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <StatBlock value={correct} label="Correct" color="#1db954" icon="✓" />
          <StatBlock value={wrong}   label="Incorrect" color="#e74c3c" icon="✗" />
          <StatBlock value={skipped} label="Skipped" color="#6b6b6b" icon="⚪" />
          {mode === 'exam' && <StatBlock value={flagged} label="Flagged" color="#f69c08" icon="🚩" />}
        </div>
      </div>

      {/* ── Metric Highlights ─────────────────────────────────── */}
      <div className={`${styles.extraStats} animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
        <ExtraStat label="Final Score" value={`${correct} / ${total}`} />
        <ExtraStat label="Passing Mark" value="70%" color="#c56af5" />
        <ExtraStat label="Accuracy" value={`${pct}%`} color={ringColor} />
        <ExtraStat label="Time Taken" value={formatTime(elapsed)} color="var(--accent)" />
      </div>

      {/* ── Actions Bar ───────────────────────────────────────── */}
      <div className={`${styles.actionBar} animate-fadeInUp`} style={{ animationDelay: '0.15s' }}>
        <button className="btn btn-primary btn-lg" onClick={restartQuiz}>
          🔄 Retake This Test
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => startQuiz(activeQuiz.id, mode === 'exam' ? 'practice' : 'exam')}>
          {mode === 'exam' ? '⚡ Switch to Practice Mode' : '⏱️ Try Real Exam Simulation'}
        </button>
        <button className="btn btn-ghost btn-lg" onClick={goToHistory}>
          📊 My Progress History
        </button>
        <button className="btn btn-ghost btn-lg" onClick={goHome}>
          🏠 Browse All Quizzes
        </button>
      </div>

      {/* ── Detailed Question Review Section ─────────────────── */}
      <div className={`${styles.reviewSection} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
        <div className={styles.reviewSectionHeader}>
          <div>
            <h2 className={styles.reviewTitle}>📝 Detailed Answer Review</h2>
            <p className={styles.reviewSub}>Review all questions with complete technical explanations and key CIS-DF takeaways.</p>
          </div>

          {/* Filter Pills */}
          <div className={styles.filterPills}>
            <button
              className={`${styles.filterPill} ${filter === 'all' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({total})
            </button>
            <button
              className={`${styles.filterPill} ${filter === 'incorrect' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('incorrect')}
            >
              ❌ Incorrect ({wrong})
            </button>
            <button
              className={`${styles.filterPill} ${filter === 'correct' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('correct')}
            >
              ✅ Correct ({correct})
            </button>
            {mode === 'exam' && flagged > 0 && (
              <button
                className={`${styles.filterPill} ${filter === 'flagged' ? styles.filterPillActive : ''}`}
                onClick={() => setFilter('flagged')}
              >
                🚩 Flagged ({flagged})
              </button>
            )}
            {skipped > 0 && (
              <button
                className={`${styles.filterPill} ${filter === 'skipped' ? styles.filterPillActive : ''}`}
                onClick={() => setFilter('skipped')}
              >
                ⚪ Skipped ({skipped})
              </button>
            )}
          </div>
        </div>

        {/* Question Review Cards */}
        <div className={styles.reviewList}>
          {filteredQuestions.map(({ q, answer, isFlagged, index }) => (
            <ReviewItem key={q.id || index} q={q} answer={answer} isFlagged={isFlagged} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBlock({ value, label, color, icon }) {
  return (
    <div className={styles.statBlock}>
      <span className={styles.statVal} style={{ color }}>{icon} {value}</span>
      <span className={styles.statDesc}>{label}</span>
    </div>
  );
}

function ExtraStat({ label, value, color }) {
  return (
    <div className={styles.extraStat}>
      <span className={styles.extraVal} style={color ? { color } : {}}>{value}</span>
      <span className={styles.extraDesc}>{label}</span>
    </div>
  );
}

function ReviewItem({ q, answer, isFlagged, index }) {
  const isCorrect = answer?.isCorrect;
  const selectedIndices = answer?.selectedIndices || (answer?.selectedIndex !== undefined && answer.selectedIndex !== -1 ? [answer.selectedIndex] : []);
  const targetIndices = q.correctIndices || (q.correctIndex !== undefined ? [q.correctIndex] : [0]);

  return (
    <div className={`${styles.reviewCard} ${isCorrect ? styles.reviewCardCorrect : styles.reviewCardWrong}`}>
      <div className={styles.reviewCardHeader}>
        <div className={styles.reviewCardMeta}>
          <span className={`${styles.statusBadge} ${isCorrect ? styles.badgeCorrect : styles.badgeWrong}`}>
            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
          <span className={styles.qIndexTag}>Question {index + 1}</span>
          <span className={styles.qCatTag}>{q.category}</span>
          {isFlagged && <span className={styles.flaggedTag}>🚩 Flagged</span>}
        </div>
      </div>

      <h3 className={styles.reviewQuestionText}>{q.question}</h3>

      {/* Options Breakdown */}
      <div className={styles.reviewOptionsList}>
        {q.options.map((opt, idx) => {
          const isTarget = targetIndices.includes(idx);
          const isUserPicked = selectedIndices.includes(idx);

          let optionStyle = styles.reviewOptionNormal;
          if (isTarget && isUserPicked) optionStyle = styles.reviewOptionTargetPicked;
          else if (isTarget && !isUserPicked) optionStyle = styles.reviewOptionTargetMissed;
          else if (!isTarget && isUserPicked) optionStyle = styles.reviewOptionWrongPicked;

          return (
            <div key={idx} className={`${styles.reviewOptionRow} ${optionStyle}`}>
              <div className={styles.reviewOptionIndicator}>
                <span className={styles.reviewOptionLetter}>{String.fromCharCode(65 + idx)}</span>
                {isTarget && <span className={styles.correctMarker}>✓</span>}
                {!isTarget && isUserPicked && <span className={styles.wrongMarker}>✗</span>}
              </div>
              <span className={styles.reviewOptionText}>{opt}</span>
              {isTarget && isUserPicked && <span className={styles.tagPickedCorrect}>Your Correct Pick</span>}
              {!isTarget && isUserPicked && <span className={styles.tagPickedWrong}>Your Selection</span>}
              {isTarget && !isUserPicked && <span className={styles.tagMissedCorrect}>Correct Answer</span>}
            </div>
          );
        })}
      </div>

      {/* In-depth Explanation Box */}
      <div className={styles.reviewExpBox}>
        <div className={styles.reviewExpHeader}>
          <span className={styles.reviewExpIcon}>💡</span>
          <strong className={styles.reviewExpTitle}>Technical Explanation &amp; Rationale:</strong>
        </div>
        <p className={styles.reviewExpText}>{q.explanation}</p>
      </div>
    </div>
  );
}
