import { useState } from 'react';
import styles from './HistoryPage.module.css';
import { useQuiz } from '../../context/QuizContext';
import { formatTime } from '../../utils/constants';

export default function HistoryPage() {
  const { state, viewPastResult, startQuiz, deleteHistoryItem, clearAllHistory, goHome } = useQuiz();
  const { examHistory } = state;

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'exam' | 'practice' | 'passed' | 'failed'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalAttempts = examHistory.length;
  const passedAttempts = examHistory.filter(h => h.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  const scores = examHistory.map(h => h.pct || 0);
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const totalSeconds = examHistory.reduce((acc, h) => acc + (h.timeSpent || 0), 0);

  const filteredHistory = examHistory.filter(item => {
    if (activeFilter === 'exam') return item.mode === 'exam';
    if (activeFilter === 'practice') return item.mode === 'practice';
    if (activeFilter === 'passed') return item.passed;
    if (activeFilter === 'failed') return !item.passed;
    return true;
  });

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
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
      {/* ── Page Header ────────────────────────────────────────── */}
      <header className={`${styles.header} animate-fadeInUp`}>
        <div className={styles.headerBadge}>📊 Learning Analytics &amp; History</div>
        <h1 className={styles.title}>My Exam Progress &amp; Records</h1>
        <p className={styles.subtitle}>
          Track your CIS-DF test scores, review past question rationales, and monitor your readiness for the 70% passing mark.
        </p>
      </header>

      {totalAttempts === 0 ? (
        /* ── Empty State ───────────────────────────────────────── */
        <div className={`${styles.emptyCard} animate-fadeInUp`}>
          <span className={styles.emptyIcon}>📈</span>
          <h2 className={styles.emptyTitle}>No Completed Exams Yet</h2>
          <p className={styles.emptyDesc}>
            Take your first full-length mock exam or topic practice session. Your scores, accuracy, and in-depth answer reviews will be automatically stored here!
          </p>
          <div className={styles.emptyActions}>
            <button className="btn btn-primary btn-lg" onClick={() => startQuiz('set-1', 'practice')}>
              🚀 Start Practice Exam 1 (80 Qs)
            </button>
            <button className="btn btn-secondary btn-lg" onClick={goHome}>
              🏠 Browse All Quizzes
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Stats Highlights Row ─────────────────────────────── */}
          <section className={`${styles.statsGrid} animate-fadeInUp`} style={{ animationDelay: '0.05s' }}>
            <div className={styles.statCard}>
              <div className={styles.statIconBadge} style={{ background: 'rgba(164, 53, 240, 0.15)', color: 'var(--primary-light)' }}>
                📝
              </div>
              <div className={styles.statData}>
                <span className={styles.statVal}>{totalAttempts}</span>
                <span className={styles.statLabel}>Tests Completed</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBadge} style={{ background: 'rgba(29, 185, 84, 0.15)', color: '#1db954' }}>
                🏆
              </div>
              <div className={styles.statData}>
                <span className={styles.statVal} style={{ color: '#1db954' }}>{passRate}%</span>
                <span className={styles.statLabel}>Pass Rate ({passedAttempts}/{totalAttempts})</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBadge} style={{ background: 'rgba(246, 156, 8, 0.15)', color: '#f69c08' }}>
                ⭐
              </div>
              <div className={styles.statData}>
                <span className={styles.statVal} style={{ color: bestScore >= 70 ? '#1db954' : '#f69c08' }}>
                  {bestScore}%
                </span>
                <span className={styles.statLabel}>Best Score Achieved</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBadge} style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#3498db' }}>
                ⏱️
              </div>
              <div className={styles.statData}>
                <span className={styles.statVal}>{formatTime(totalSeconds)}</span>
                <span className={styles.statLabel}>Total Study Time</span>
              </div>
            </div>
          </section>

          {/* ── Filter Bar & Actions ─────────────────────────────── */}
          <section className={`${styles.controlsBar} animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterPill} ${activeFilter === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Attempts ({totalAttempts})
              </button>
              <button
                className={`${styles.filterPill} ${activeFilter === 'exam' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('exam')}
              >
                ⏱️ Real Exams ({examHistory.filter(h => h.mode === 'exam').length})
              </button>
              <button
                className={`${styles.filterPill} ${activeFilter === 'practice' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('practice')}
              >
                ⚡ Practice ({examHistory.filter(h => h.mode === 'practice').length})
              </button>
              <button
                className={`${styles.filterPill} ${activeFilter === 'passed' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('passed')}
              >
                ✅ Passed ({passedAttempts})
              </button>
              <button
                className={`${styles.filterPill} ${activeFilter === 'failed' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('failed')}
              >
                ❌ Needs Work ({totalAttempts - passedAttempts})
              </button>
            </div>

            <button
              className={styles.clearBtn}
              onClick={() => setShowClearConfirm(true)}
              title="Clear all saved exam history"
            >
              🗑️ Clear History
            </button>
          </section>

          {/* ── History Cards List ──────────────────────────────── */}
          <section className={`${styles.historyList} animate-fadeInUp`} style={{ animationDelay: '0.15s' }}>
            {filteredHistory.map((item) => {
              const isPassed = item.pct >= 70;
              const ringColor = isPassed ? '#1db954' : '#e74c3c';

              return (
                <div key={item.id} className={`${styles.historyCard} ${isPassed ? styles.cardPassed : styles.cardFailed}`}>
                  <div className={styles.cardGlow} style={{ background: ringColor }} />

                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.modeBadge} style={item.mode === 'exam' ? { background: 'rgba(164, 53, 240, 0.15)', color: 'var(--primary-light)' } : { background: 'rgba(246, 156, 8, 0.15)', color: '#ffc85e' }}>
                        {item.mode === 'exam' ? '⏱️ Real Exam Mode' : '⚡ Practice Mode'}
                      </span>
                      <span className={styles.dateText}>📅 {formatDate(item.date)}</span>
                    </div>

                    <div className={styles.cardHeaderRight}>
                      <span className={`${styles.statusPill} ${isPassed ? styles.statusPassed : styles.statusFailed}`}>
                        {isPassed ? '✓ PASSED (≥70%)' : '✗ NOT PASSED (<70%)'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMainInfo}>
                      <h3 className={styles.examTitle}>{item.quizTitle}</h3>
                      <div className={styles.metricsRow}>
                        <span className={styles.metricItem}>
                          <strong style={{ color: '#1db954' }}>{item.correct}</strong> Correct
                        </span>
                        <span>●</span>
                        <span className={styles.metricItem}>
                          <strong style={{ color: '#e74c3c' }}>{item.wrong}</strong> Incorrect
                        </span>
                        <span>●</span>
                        <span className={styles.metricItem}>
                          <strong>{item.skipped}</strong> Skipped
                        </span>
                        {item.mode === 'exam' && item.flagged > 0 && (
                          <>
                            <span>●</span>
                            <span className={styles.metricItem} style={{ color: '#ffc85e' }}>
                              <strong>{item.flagged}</strong> Flagged
                            </span>
                          </>
                        )}
                        <span>●</span>
                        <span className={styles.metricItem}>
                          ⏱️ {formatTime(item.timeSpent)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.scoreBlock}>
                      <div className={styles.scoreCircle} style={{ borderColor: ringColor, color: ringColor }}>
                        <span className={styles.scoreNumber}>{item.pct}%</span>
                        <span className={styles.scoreLabel}>Score</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardActions}>
                      <button className="btn btn-primary btn-sm" onClick={() => viewPastResult(item)}>
                        📋 View Score Report &amp; Answers
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => startQuiz(item.quizId, item.mode)}>
                        🔄 Retake
                      </button>
                    </div>

                    <button
                      className={styles.deleteItemBtn}
                      onClick={() => deleteHistoryItem(item.id)}
                      title="Delete this record"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* ── Clear All History Confirmation Modal ───────────────── */}
      {showClearConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowClearConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <span className={styles.modalIcon}>⚠️</span>
            <h2 className={styles.modalTitle}>Clear all exam history?</h2>
            <p className={styles.modalSub}>
              This will permanently delete all {totalAttempts} saved exam records and statistics from your device.
            </p>
            <div className={styles.modalActions}>
              <button className="btn btn-secondary" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#e74c3c' }}
                onClick={() => {
                  clearAllHistory();
                  setShowClearConfirm(false);
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
