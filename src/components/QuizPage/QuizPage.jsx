import { useEffect, useCallback } from 'react';
import styles from './QuizPage.module.css';
import { useQuiz } from '../../context/QuizContext';
import { CATEGORY_CONFIG, formatTime } from '../../utils/constants';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizPage() {
  const {
    state,
    toggleOption,
    submitMultiAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    finishQuiz,
    goHome
  } = useQuiz();

  const { activeQuiz, currentIndex, answers, pendingSelections, revealed, timeLeft } = state;

  const q = activeQuiz.questions[currentIndex];
  const total = activeQuiz.questions.length;
  const currentAnswer = answers[currentIndex];
  const progress = Math.round((currentIndex / total) * 100);

  const targetIndices = q.correctIndices || (q.correctIndex !== undefined ? [q.correctIndex] : [0]);
  const isMulti = q.multiSelect || targetIndices.length > 1;
  const requiredCount = targetIndices.length;

  const allAnswered = answers.every(Boolean);
  const isLast = currentIndex === total - 1;
  const canFinish = (isLast && !!currentAnswer) || allAnswered;

  // Keyboard shortcuts
  const handleKey = useCallback((e) => {
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, a: 0, b: 1, c: 2, d: 3, e: 4 };
    if (map[e.key] !== undefined && !revealed) {
      toggleOption(map[e.key]);
    }
    if (e.key === 'Enter') {
      if (isMulti && !revealed && pendingSelections.length > 0) {
        submitMultiAnswer();
      } else if (revealed && !isLast) {
        nextQuestion();
      }
    }
    if (e.key === 'ArrowRight' && revealed && !isLast) nextQuestion();
    if (e.key === 'ArrowLeft') prevQuestion();
  }, [revealed, isLast, isMulti, pendingSelections, toggleOption, submitMultiAnswer, nextQuestion, prevQuestion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const timerClass = timeLeft <= 5 ? styles.timerDanger : timeLeft <= 15 ? styles.timerWarning : '';

  return (
    <div className={styles.page}>
      {/* Back bar */}
      <div className={styles.backBar}>
        <button className="btn btn-ghost btn-sm" onClick={goHome}>← Back</button>
        <span className={styles.quizTitle}>{activeQuiz.title}</span>
      </div>

      {/* Progress Header */}
      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <div className={styles.progressLabel}>
            <span>Question {currentIndex + 1} of {total}</span>
            <span className={styles.progressPct}>{progress}%</span>
          </div>
          <div className={styles.progressTrack} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={`${styles.timer} ${timerClass}`}>
          <span className={styles.timerVal}>{formatTime(timeLeft)}</span>
          <span className={styles.timerLabel}>Time</span>
        </div>
      </div>

      {/* Question Card */}
      <article className={styles.questionCard} key={currentIndex}>
        <div className={styles.questionMeta}>
          <div className={styles.metaLeft}>
            <span className={styles.qBadge}>Q{currentIndex + 1}</span>
            <span className={styles.catBadge}>
              {CATEGORY_CONFIG[q.category]?.icon} {q.category}
            </span>
          </div>
          <div className={styles.metaRight}>
            {isMulti ? (
              <span className={styles.multiBadge}>
                ☑️ Select {requiredCount} options
              </span>
            ) : (
              <span className={styles.singleBadge}>
                ⚪ Single choice
              </span>
            )}
          </div>
        </div>

        <h2 className={styles.questionText}>{q.question}</h2>

        {/* Options */}
        <div className={styles.options} role={isMulti ? 'group' : 'radiogroup'}>
          {q.options.map((opt, i) => {
            const isSelected = revealed
              ? currentAnswer?.selectedIndices?.includes(i)
              : pendingSelections.includes(i);

            const isCorrectTarget = targetIndices.includes(i);
            const isCorrect = revealed && isCorrectTarget;
            const isWrong = revealed && isSelected && !isCorrectTarget;

            let cls = styles.option;
            if (isCorrect) cls += ` ${styles.optCorrect}`;
            else if (isWrong) cls += ` ${styles.optWrong}`;
            else if (isSelected) cls += ` ${styles.optSelected}`;
            if (revealed) cls += ` ${styles.optDisabled}`;

            return (
              <div
                key={i}
                className={cls}
                onClick={() => !revealed && toggleOption(i)}
                tabIndex={revealed ? -1 : 0}
                role={isMulti ? 'checkbox' : 'radio'}
                aria-checked={isSelected}
                onKeyDown={e => e.key === 'Enter' && !revealed && toggleOption(i)}
              >
                <div className={`${styles.optLetter} ${isMulti ? styles.optLetterSquare : ''}`}>
                  {isMulti && isSelected && !revealed ? '✓' : LETTERS[i]}
                </div>
                <div className={styles.optText}>{opt}</div>
                {isCorrect && <span className={styles.optIcon}>✓</span>}
                {isWrong  && <span className={styles.optIcon}>✗</span>}
              </div>
            );
          })}
        </div>

        {/* Submit button for Multi-Select */}
        {isMulti && !revealed && (
          <div className={styles.submitRow}>
            <button
              className="btn btn-primary"
              onClick={submitMultiAnswer}
              disabled={pendingSelections.length === 0}
            >
              Submit Answer ({pendingSelections.length}/{requiredCount} selected)
            </button>
          </div>
        )}

        {/* Explanation */}
        {revealed && (
          <div className={`${styles.explanation} animate-fadeInUp`}>
            <div className={styles.explanationHeader}>
              <span>💡 Explanation</span>
              {currentAnswer?.isCorrect ? (
                <span className={styles.badgeCorrect}>✓ Correct</span>
              ) : (
                <span className={styles.badgeWrong}>✗ Incorrect</span>
              )}
            </div>
            <p className={styles.explanationText}>{q.explanation}</p>
          </div>
        )}
      </article>

      {/* Navigation */}
      <nav className={styles.nav}>
        <button className="btn btn-ghost btn-sm" onClick={prevQuestion} disabled={currentIndex === 0}>
          ← Prev
        </button>

        {/* Dot map */}
        <div className={`${styles.dots} no-scrollbar`}>
          {answers.map((ans, i) => {
            let cls = styles.dot;
            if (i === currentIndex) cls += ` ${styles.dotCurrent}`;
            if (ans?.isCorrect) cls += ` ${styles.dotCorrect}`;
            else if (ans !== null) cls += ` ${styles.dotWrong}`;
            return (
              <button
                key={i}
                className={cls}
                onClick={() => jumpToQuestion(i)}
                title={`Question ${i + 1}`}
                aria-label={`Jump to question ${i + 1}`}
              />
            );
          })}
        </div>

        <div className={styles.navRight}>
          {canFinish && (
            <button className="btn btn-success btn-sm" onClick={finishQuiz}>
              Finish 🏁
            </button>
          )}
          {!isLast && (
            <button className="btn btn-secondary btn-sm" onClick={nextQuestion} disabled={!revealed}>
              Next →
            </button>
          )}
        </div>
      </nav>

      {/* Keyboard hint */}
      <p className={styles.hint}>
        Tip: Press <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd> to {isMulti ? 'toggle' : 'answer'} &nbsp;•&nbsp;
        {isMulti && !revealed ? <><kbd>Enter</kbd> to submit &nbsp;•&nbsp;</> : null}
        <kbd>→</kbd> next question
      </p>
    </div>
  );
}
