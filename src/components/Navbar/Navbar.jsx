import styles from './Navbar.module.css';
import { useQuiz } from '../../context/QuizContext';

export default function Navbar() {
  const { state, toggleTheme, goHome, goToHistory, goToQuickLearning } = useQuiz();
  const { page, allQuestions, answers, theme, examHistory } = state;

  const answeredCount = answers.filter(Boolean).length;
  const correctCount = answers.filter(a => a?.isCorrect).length;
  const historyCount = examHistory?.length || 0;

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
            className={`${styles.navLink} ${page === 'history' ? styles.navLinkActive : ''}`}
            onClick={goToHistory}
          >
            📊 My Progress {historyCount > 0 && <span className={styles.navCountBadge}>{historyCount}</span>}
          </button>
          <button
            className={`${styles.navLink} ${page === 'quick-learning' ? styles.navLinkActive : ''}`}
            onClick={goToQuickLearning}
          >
            ⚡ Quick Learning
          </button>
        </div>

        {/* Right tools: Question Counter, Live Score & Theme Toggle */}
        <div className={styles.right}>
          <div className={styles.badge}>
            <span>📚</span>
            <span>{allQuestions.length || 160} Questions</span>
          </div>

          {page === 'quiz' && answeredCount > 0 && (
            <div className={`${styles.badge} ${styles.scoreBadge}`}>
              <span>⚡</span>
              <span>{correctCount}/{answeredCount}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            className={styles.themeToggleBtn}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
