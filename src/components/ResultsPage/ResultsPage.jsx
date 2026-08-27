import { useEffect, useRef } from 'react';
import styles from './ResultsPage.module.css';
import { useQuiz } from '../../context/QuizContext';
import { RESULT_CONFIG, formatTime } from '../../utils/constants';

export default function ResultsPage() {
  const { state, restartQuiz, goHome } = useQuiz();
  const { activeQuiz, answers, quizStartTime } = state;
  const questions = activeQuiz.questions;

  const correct = answers.filter(a => a?.isCorrect).length;
  const wrong   = answers.filter(a => a && !a.isCorrect && a.selectedIndex !== -1).length;
  const skipped = answers.filter(a => !a || a.selectedIndex === -1).length;
  const total   = questions.length;
  const pct     = Math.round((correct / total) * 100);
  const elapsed = Math.round((Date.now() - quizStartTime) / 1000);

  const result  = RESULT_CONFIG.find(r => pct >= r.min);
  const ringColor = pct >= 75 ? '#1db954' : pct >= 50 ? '#f69c08' : '#e74c3c';

  // Animate ring
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

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={`${styles.header} animate-bounceIn`}>
        <span className={styles.emoji}>{result.emoji}</span>
        <h1 className={styles.title}>{result.title}</h1>
        <p className={styles.subtitle}>{result.subtitle}</p>
      </div>

      {/* Score Ring */}
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
          <StatBlock value={correct} label="Correct" color="#1db954" />
          <StatBlock value={wrong}   label="Wrong"   color="#e74c3c" />
          <StatBlock value={skipped} label="Skipped" color="#6b6b6b" />
        </div>
      </div>

      {/* Extra stats */}
      <div className={`${styles.extraStats} animate-fadeInUp`} style={{ animationDelay: '0.15s' }}>
        <ExtraStat label="Final Score"  value={`${correct}/${total}`} />
        <ExtraStat label="Accuracy"     value={`${pct}%`}            color="var(--primary-light)" />
        <ExtraStat label="Time Taken"   value={formatTime(elapsed)}   color="var(--accent)" />
      </div>

      {/* Perf bars */}
      <div className={`${styles.perfCard} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
        <h3 className={styles.perfTitle}>📊 Performance Breakdown</h3>
        <PerfBar label="Correct" count={correct} total={total} color="#1db954" delay={0.5} />
        <PerfBar label="Wrong"   count={wrong}   total={total} color="#e74c3c" delay={0.65} />
        <PerfBar label="Skipped" count={skipped} total={total} color="#6b6b6b" delay={0.8} />
      </div>

      {/* Detailed Review */}
      <div className={`${styles.reviewSection} animate-fadeInUp`} style={{ animationDelay: '0.25s' }}>
        <h2 className={styles.reviewTitle}>📝 Detailed Review</h2>
        {questions.map((q, i) => (
          <ReviewItem key={q.id} q={q} answer={answers[i]} index={i} />
        ))}
      </div>

      {/* Actions */}
      <div className={`${styles.actions} animate-fadeInUp`} style={{ animationDelay: '0.3s' }}>
        <button className="btn btn-primary btn-lg" onClick={restartQuiz}>🔄 Try Again</button>
        <button className="btn btn-secondary btn-lg" onClick={goHome}>🏠 Browse More Quizzes</button>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */
function StatBlock({ value, label, color }) {
  return (
    <div className={styles.statBlock}>
      <span className={styles.statVal} style={{ color }}>{value}</span>
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

function PerfBar({ label, count, total, color, delay }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className={styles.perfRow}>
      <span className={styles.perfLabel}>{label}</span>
      <div className={styles.perfTrack}>
        <div
          className={styles.perfFill}
          style={{
            width: `${pct}%`,
            background: color,
            transitionDelay: `${delay}s`,
          }}
        />
      </div>
      <span className={styles.perfCount} style={{ color }}>{count}</span>
    </div>
  );
}

function ReviewItem({ q, answer, index }) {
  const isCorrect = answer?.isCorrect;
  const selectedIndices = answer?.selectedIndices ?? (answer?.selectedIndex !== undefined && answer.selectedIndex !== -1 ? [answer.selectedIndex] : []);
  const targetIndices = q.correctIndices || (q.correctIndex !== undefined ? [q.correctIndex] : [0]);

  const yourAnswerText = selectedIndices.length > 0
    ? selectedIndices.map(i => q.options[i]).join('; ')
    : null;

  const correctAnswerText = targetIndices.map(i => q.options[i]).join('; ');

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={`${styles.reviewIcon} ${isCorrect ? styles.iconCorrect : styles.iconWrong}`}>
          {isCorrect ? '✓' : '✗'}
        </div>
        <p className={styles.reviewQ}>
          <strong>Q{index + 1}.</strong> {q.question}
        </p>
      </div>

      <div className={styles.reviewAnswers}>
        {yourAnswerText && !isCorrect && (
          <div className={`${styles.ansRow} ${styles.ansWrong}`}>
            ✗ Your answer: {yourAnswerText}
          </div>
        )}
        {!yourAnswerText && (
          <div className={`${styles.ansRow} ${styles.ansSkipped}`}>
            ⏱ Time expired / Skipped
          </div>
        )}
        <div className={`${styles.ansRow} ${styles.ansCorrect}`}>
          ✓ Correct: {correctAnswerText}
        </div>
      </div>

      <div className={styles.reviewExp}>
        💡 {q.explanation}
      </div>
    </div>
  );
}
