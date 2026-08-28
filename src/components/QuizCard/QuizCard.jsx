import styles from './QuizCard.module.css';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, getDominantDifficulty } from '../../utils/constants';
import { useQuiz } from '../../context/QuizContext';

export default function QuizCard({ set, delay = 0 }) {
  const { openModeModal, startQuiz } = useQuiz();
  const conf = CATEGORY_CONFIG[set.category] || CATEGORY_CONFIG['Mixed'];
  const difficulty = getDominantDifficulty(set.questions);
  const diffConf = DIFFICULTY_CONFIG[difficulty];
  const minutes = set.totalTimeMins || Math.ceil((set.questions.length * (set.timePerQ || 60)) / 60);

  return (
    <article
      className={`${styles.card} ${set.isExamSet ? styles.examSetCard : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => openModeModal(set.id)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && openModeModal(set.id)}
      aria-label={`Configure ${set.title}`}
    >
      {/* Coloured banner strip */}
      <div className={styles.banner} style={{ background: conf.gradient }} />

      <div className={styles.body}>
        {/* Tags */}
        <div className={styles.meta}>
          <span className={styles.catTag} style={{ background: conf.bg, color: conf.color }}>
            {conf.icon} {set.badge || set.category}
          </span>
          <span className={styles.diffTag} style={{ background: diffConf.bg, color: diffConf.color }}>
            {diffConf.label}
          </span>
        </div>

        {/* Title & desc */}
        <h3 className={styles.title}>{set.title}</h3>
        <p className={styles.desc}>{set.description}</p>

        {/* Info row */}
        <div className={styles.infoRow}>
          <span className={styles.infoItem}>📝 {set.questions.length} Questions</span>
          <span className={styles.infoItem}>⏱️ ~{minutes} min</span>
        </div>

        {/* Dual Mode Action Buttons */}
        <div className={styles.actionButtons} onClick={e => e.stopPropagation()}>
          <button
            className={styles.practiceBtn}
            onClick={() => startQuiz(set.id, 'practice')}
            title="Start in Practice Mode (Instant Answers & Explanations)"
          >
            ⚡ Practice
          </button>
          <button
            className={styles.examBtn}
            onClick={() => startQuiz(set.id, 'exam')}
            title="Start in Real Exam Mode (Timed Simulation, Answers at End)"
          >
            ⏱️ Real Exam
          </button>
        </div>
      </div>
    </article>
  );
}
