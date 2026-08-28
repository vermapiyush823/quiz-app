import { useState } from 'react';
import styles from './QuizPage.module.css';
import { useQuiz } from '../../context/QuizContext';
import { CATEGORY_CONFIG, formatTime } from '../../utils/constants';

export default function QuizPage() {
  const {
    state,
    toggleOption,
    submitMultiAnswer,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    finishQuiz,
    goHome
  } = useQuiz();

  const {
    activeQuiz,
    currentIndex,
    answers,
    pendingSelections,
    flags,
    revealed,
    timeLeft,
    examTimeLeft,
    mode
  } = state;

  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  if (!activeQuiz) return null;

  const q = activeQuiz.questions[currentIndex];
  const qCount = activeQuiz.questions.length;
  const currentAnswer = answers[currentIndex];
  const isFlagged = flags[currentIndex] || false;

  const isMulti = q.multiSelect || (q.correctIndices && q.correctIndices.length > 1);
  const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
  const catConf = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG['Mixed'];

  const answeredCount = answers.filter(a => a !== null && a.selectedIndices.length > 0).length;
  const flaggedCount = flags.filter(Boolean).length;
  const isLastQuestion = currentIndex === qCount - 1;

  // Selected indices for the current question
  const currentSelected = mode === 'practice'
    ? (revealed && currentAnswer ? currentAnswer.selectedIndices : pendingSelections)
    : (currentAnswer ? currentAnswer.selectedIndices : pendingSelections);

  const handleOptionClick = (idx) => {
    toggleOption(idx);
  };

  const handleConfirmFinish = () => {
    setShowSubmitModal(false);
    finishQuiz();
  };

  return (
    <div className={styles.page}>
      {/* ── Top App Bar ────────────────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={goHome} title="Exit Quiz to Home">
            ← Exit
          </button>
          <div className={styles.quizInfo}>
            <span className={styles.quizTitle}>{activeQuiz.title}</span>
            <span className={styles.modeBadge} style={mode === 'exam' ? { background: 'rgba(164, 53, 240, 0.2)', color: '#c56af5' } : { background: 'rgba(246, 156, 8, 0.15)', color: '#ffc85e' }}>
              {mode === 'exam' ? '⏱️ Real Exam Mode' : '⚡ Practice Mode'}
            </span>
          </div>
        </div>

        <div className={styles.topBarRight}>
          {/* Timer Display */}
          <div className={`${styles.timerBox} ${mode === 'exam' && examTimeLeft < 300 ? styles.timerUrgent : ''}`}>
            <span className={styles.timerIcon}>{mode === 'exam' ? '⏳' : '⏱️'}</span>
            <span className={styles.timerText}>
              {mode === 'exam' ? formatTime(examTimeLeft) : `${timeLeft}s`}
            </span>
          </div>

          {/* Exam Mode: Flag Toggle */}
          {mode === 'exam' && (
            <button
              className={`${styles.flagBtn} ${isFlagged ? styles.flagBtnActive : ''}`}
              onClick={toggleFlag}
              title={isFlagged ? 'Unmark review flag' : 'Mark question for review'}
            >
              {isFlagged ? '🚩 Flagged' : '🏳️ Flag'}
            </button>
          )}

          {/* Question Palette Drawer Toggle */}
          <button
            className={`${styles.paletteToggleBtn} ${showPalette ? styles.paletteToggleActive : ''}`}
            onClick={() => setShowPalette(!showPalette)}
            title="Open Question Navigator"
          >
            📊 Navigator ({answeredCount}/{qCount})
          </button>

          {/* Submit Exam Button */}
          {mode === 'exam' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowSubmitModal(true)}>
              Submit Exam
            </button>
          )}
        </div>
      </header>

      {/* ── Progress Bar ──────────────────────────────────────── */}
      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${((currentIndex + 1) / qCount) * 100}%` }}
        />
      </div>

      {/* ── Main Quiz Layout ──────────────────────────────────── */}
      <div className={styles.mainLayout}>
        <div className={styles.questionContainer}>
          {/* Question Meta Header */}
          <div className={styles.qMetaHeader}>
            <div className={styles.qMetaLeft}>
              <span className={styles.qNumber}>Question {currentIndex + 1} of {qCount}</span>
              <span className={styles.categoryBadge} style={{ background: catConf.bg, color: catConf.color }}>
                {catConf.icon} {q.category}
              </span>
              {isMulti && (
                <span className={styles.multiBadge}>
                  ☑️ Choose {targetIndices.length} Options
                </span>
              )}
            </div>

            {mode === 'exam' && isFlagged && (
              <span className={styles.flaggedIndicator}>🚩 Marked for Review</span>
            )}
          </div>

          {/* Question Body */}
          <h1 className={styles.questionText}>{q.question}</h1>

          {/* Options List */}
          <div className={styles.optionsList} role={isMulti ? 'group' : 'radiogroup'}>
            {q.options.map((opt, idx) => {
              const isSelected = currentSelected.includes(idx);
              const isTargetCorrect = targetIndices.includes(idx);

              let optionStateClass = '';
              if (mode === 'practice' && revealed) {
                if (isSelected && isTargetCorrect) {
                  optionStateClass = styles.optCorrect;
                } else if (isSelected && !isTargetCorrect) {
                  optionStateClass = styles.optIncorrect;
                } else if (!isSelected && isTargetCorrect) {
                  optionStateClass = styles.optMissed;
                }
              } else if (isSelected) {
                optionStateClass = styles.optSelected;
              }

              return (
                <button
                  key={idx}
                  className={`${styles.optionItem} ${optionStateClass}`}
                  onClick={() => handleOptionClick(idx)}
                  disabled={mode === 'practice' && revealed}
                  aria-pressed={isSelected}
                >
                  <div className={styles.optionIndicator}>
                    {isMulti ? (
                      <span className={styles.checkboxBox}>{isSelected ? '✓' : ''}</span>
                    ) : (
                      <span className={styles.radioDot} />
                    )}
                    <span className={styles.letterLabel}>{String.fromCharCode(65 + idx)}</span>
                  </div>
                  <span className={styles.optionLabel}>{opt}</span>

                  {mode === 'practice' && revealed && isTargetCorrect && (
                    <span className={styles.resultBadgeCorrect}>✓ Correct</span>
                  )}
                  {mode === 'practice' && revealed && isSelected && !isTargetCorrect && (
                    <span className={styles.resultBadgeIncorrect}>✗ Incorrect</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Practice Mode: Multi-Select Submit Button */}
          {mode === 'practice' && isMulti && !revealed && (
            <div className={styles.multiSubmitContainer}>
              <button
                className="btn btn-primary btn-lg"
                onClick={submitMultiAnswer}
                disabled={pendingSelections.length === 0}
              >
                Submit Answer ({pendingSelections.length}/{targetIndices.length} selected)
              </button>
            </div>
          )}

          {/* Practice Mode: Instant Detailed Explanation Box */}
          {mode === 'practice' && revealed && (
            <div className={`${styles.explanationBox} animate-fadeIn`}>
              <div className={styles.expHeader}>
                <span className={styles.expIcon}>
                  {currentAnswer?.isCorrect ? '🎉' : '💡'}
                </span>
                <div>
                  <h3 className={styles.expTitle}>
                    {currentAnswer?.isCorrect ? 'Correct Answer!' : 'Explanation & Key Concepts'}
                  </h3>
                  <span className={styles.expSub}>ServiceNow CIS-DF Technical Guidance</span>
                </div>
              </div>
              <p className={styles.expBody}>{q.explanation}</p>
            </div>
          )}

          {/* Navigation Controls Footer */}
          <div className={styles.navControls}>
            <button
              className="btn btn-secondary"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            <div className={styles.navControlsRight}>
              {mode === 'exam' && (
                <button
                  className={`${styles.flagBtnSecondary} ${isFlagged ? styles.flagBtnActive : ''}`}
                  onClick={toggleFlag}
                >
                  {isFlagged ? '🚩 Flagged' : '🏳️ Mark Review'}
                </button>
              )}

              {!isLastQuestion ? (
                <button className="btn btn-primary" onClick={nextQuestion}>
                  Next Question →
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={mode === 'exam' ? () => setShowSubmitModal(true) : finishQuiz}
                >
                  {mode === 'exam' ? 'Submit Final Exam ✓' : 'Finish & View Results 🏆'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Question Navigator Drawer ─────────────────────────── */}
        <aside className={`${styles.paletteDrawer} ${showPalette ? styles.paletteDrawerOpen : ''}`}>
          <div className={styles.paletteHeader}>
            <h3 className={styles.paletteTitle}>Question Navigator</h3>
            <button className={styles.paletteCloseBtn} onClick={() => setShowPalette(false)}>✕</button>
          </div>

          <div className={styles.paletteLegend}>
            <span className={styles.legItem}><span className={`${styles.legDot} ${styles.legAnswered}`} /> Answered</span>
            <span className={styles.legItem}><span className={`${styles.legDot} ${styles.legUnanswered}`} /> Unanswered</span>
            {mode === 'exam' && (
              <span className={styles.legItem}><span className={`${styles.legDot} ${styles.legFlagged}`} /> Flagged</span>
            )}
          </div>

          <div className={styles.paletteGrid}>
            {activeQuiz.questions.map((_, i) => {
              const isAnswered = answers[i] !== null && answers[i].selectedIndices.length > 0;
              const isCurr = i === currentIndex;
              const isFlg = flags[i];

              let statusClass = styles.pUnanswered;
              if (isFlg) statusClass = styles.pFlagged;
              else if (isAnswered) statusClass = styles.pAnswered;

              return (
                <button
                  key={i}
                  className={`${styles.palettePill} ${statusClass} ${isCurr ? styles.pCurrent : ''}`}
                  onClick={() => {
                    jumpToQuestion(i);
                    setShowPalette(false);
                  }}
                  title={`Jump to Question ${i + 1}`}
                >
                  {i + 1}
                  {isFlg && <span className={styles.pFlagIcon}>•</span>}
                </button>
              );
            })}
          </div>

          <div className={styles.paletteFooter}>
            <div className={styles.paletteSummary}>
              <span>Answered: <strong>{answeredCount}</strong></span>
              <span>Remaining: <strong>{qCount - answeredCount}</strong></span>
            </div>
            {mode === 'exam' && (
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 12 }}
                onClick={() => {
                  setShowPalette(false);
                  setShowSubmitModal(true);
                }}
              >
                Submit Exam Now
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── Submit Exam Confirmation Modal (Exam Mode) ─────────── */}
      {showSubmitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSubmitModal(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>📋</span>
              <h2 className={styles.modalTitle}>Ready to submit your exam?</h2>
              <p className={styles.modalSub}>
                Review your completion status before finalizing your CIS-DF test attempt:
              </p>
            </div>

            <div className={styles.modalStatsGrid}>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatVal} style={{ color: '#1db954' }}>{answeredCount}</span>
                <span className={styles.modalStatLabel}>Answered</span>
              </div>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatVal} style={{ color: answeredCount < qCount ? '#e74c3c' : '#6b6b6b' }}>
                  {qCount - answeredCount}
                </span>
                <span className={styles.modalStatLabel}>Unanswered</span>
              </div>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatVal} style={{ color: '#f69c08' }}>{flaggedCount}</span>
                <span className={styles.modalStatLabel}>Marked for Review</span>
              </div>
            </div>

            {qCount - answeredCount > 0 && (
              <div className={styles.unansweredAlert}>
                ⚠️ You still have <strong>{qCount - answeredCount} unanswered questions</strong>. Are you sure you want to finish?
              </div>
            )}

            <div className={styles.modalActions}>
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                ← Return to Test
              </button>
              <button className="btn btn-primary" onClick={handleConfirmFinish}>
                Yes, Submit Exam &amp; View Results →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
