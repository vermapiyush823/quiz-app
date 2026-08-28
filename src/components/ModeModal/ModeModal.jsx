import styles from './ModeModal.module.css';
import { useQuiz } from '../../context/QuizContext';
import { CATEGORY_CONFIG } from '../../utils/constants';

export default function ModeModal() {
  const { state, closeModeModal, startQuiz } = useQuiz();
  const { showModeModal, selectedQuizId, quizSets } = state;

  if (!showModeModal || !selectedQuizId) return null;

  const quiz = quizSets.find(s => s.id === selectedQuizId);
  if (!quiz) return null;

  const conf = CATEGORY_CONFIG[quiz.category] || CATEGORY_CONFIG['Mixed'];
  const qCount = quiz.questions.length;
  const examMins = quiz.totalTimeMins || Math.round((qCount * 75) / 60);

  const handleStart = (mode) => {
    startQuiz(quiz.id, mode);
  };

  return (
    <div className={styles.overlay} onClick={closeModeModal}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeModeModal} aria-label="Close modal">✕</button>

        <div className={styles.header}>
          <span className={styles.badge} style={{ background: conf.bg, color: conf.color }}>
            {conf.icon} {quiz.badge || quiz.category}
          </span>
          <h2 className={styles.title}>{quiz.title}</h2>
          <p className={styles.subtitle}>
            Choose your test mode for this {qCount}-question assessment:
          </p>
        </div>

        <div className={styles.optionsGrid}>
          {/* Mode 1: Practice Mode */}
          <div className={`${styles.optionCard} ${styles.practiceCard}`} onClick={() => handleStart('practice')}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle} style={{ background: 'rgba(246, 156, 8, 0.15)', color: '#f69c08' }}>
                ⚡
              </div>
              <div>
                <h3 className={styles.cardTitle}>Practice Mode</h3>
                <span className={styles.cardSub}>Instant Feedback &amp; Explanations</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Instant answer validation after every question</li>
              <li>✓ Full 200–300 word technical explanations shown immediately</li>
              <li>✓ Best for active learning, memorization &amp; review</li>
              <li>✓ Study at your own relaxed pace</li>
            </ul>
            <button className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: 'auto' }}>
              ⚡ Start in Practice Mode
            </button>
          </div>

          {/* Mode 2: Real Exam Mode */}
          <div className={`${styles.optionCard} ${styles.examCard}`} onClick={() => handleStart('exam')}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle} style={{ background: 'rgba(164, 53, 240, 0.15)', color: '#a435f0' }}>
                ⏱️
              </div>
              <div>
                <div className={styles.examBadge}>Udemy Simulation</div>
                <h3 className={styles.cardTitle}>Real Exam Mode</h3>
                <span className={styles.cardSub}>Timed CIS-DF Certification Test</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Timed test ({examMins} minutes allocated)</li>
              <li>✓ <strong>No answers or explanations</strong> shown during the test</li>
              <li>✓ Flag &amp; Mark for Review with Question Navigator</li>
              <li>✓ Comprehensive Score Report &amp; Analysis upon full completion</li>
            </ul>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'auto' }}>
              ⏱️ Start Real Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
