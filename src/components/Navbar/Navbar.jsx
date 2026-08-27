import styles from './Navbar.module.css';
import { useQuiz } from '../../context/QuizContext';

export default function Navbar() {
  const { state, goHome, goToQuickLearning } = useQuiz();
  const { page, allQuestions, answers } = state;

  const answeredCount = answers.filter(Boolean).length;
  const correctCount = answers.filter(a => a?.isCorrect).length;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <button className={styles.logo} onClick={goHome} aria-label="Go to home">
          <div className={styles.logoIcon}>🧠</div>
          <span className={styles.logoText}>
            CIS-DF<span className={styles.logoAccent}>Master</span>
          </span>
        </button>

        {/* Center Nav Links */}
        <div className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${page === 'home' || page === 'quiz' || page === 'results' ? styles.navLinkActive : ''}`}
            onClick={goHome}
          >
            📝 Practice Exams
          </button>
          <button
            className={`${styles.navLink} ${page === 'quick-learning' ? styles.navLinkActive : ''}`}
            onClick={goToQuickLearning}
          >
            ⚡ Quick Learning Cheat Sheet
          </button>
        </div>

        {/* Right badges */}
        <div className={styles.right}>
          <div className={styles.badge}>
            <span>📚</span>
            <span>{allQuestions.length || '125'} Questions</span>
          </div>

          {page === 'quiz' && answeredCount > 0 && (
            <div className={`${styles.badge} ${styles.scoreBadge}`}>
              <span>⚡</span>
              <span>{correctCount}/{answeredCount}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
