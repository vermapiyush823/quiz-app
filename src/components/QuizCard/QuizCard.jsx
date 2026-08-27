import styles from './QuizCard.module.css';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, getDominantDifficulty } from '../../utils/constants';

export default function QuizCard({ set, onStart, delay = 0 }) {
  const conf = CATEGORY_CONFIG[set.category] || CATEGORY_CONFIG['General'];
  const difficulty = getDominantDifficulty(set.questions);
  const diffConf = DIFFICULTY_CONFIG[difficulty];
  const minutes = Math.ceil((set.questions.length * set.timePerQ) / 60);

  return (
    <article
      className={styles.card}
      onClick={() => onStart(set.id)}
      style={{ animationDelay: `${delay}s` }}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onStart(set.id)}
      aria-label={`Start ${set.title} quiz`}
    >
      {/* Coloured banner strip */}
      <div className={styles.banner} style={{ background: conf.gradient }} />

      <div className={styles.body}>
        {/* Tags */}
        <div className={styles.meta}>
          <span className={styles.catTag} style={{ background: conf.bg, color: conf.color }}>
            {conf.icon} {set.category}
          </span>
          <span className={styles.diffTag} style={{ background: diffConf.bg, color: diffConf.color }}>
            {diffConf.label}
          </span>
        </div>

        {/* Title & desc */}
        <h3 className={styles.title}>{set.title}</h3>
        <p className={styles.desc}>{set.description}</p>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.info}>
            <span className={styles.infoItem}>📝 {set.questions.length} Qs</span>
            <span className={styles.infoItem}>⏱️ ~{minutes} min</span>
          </div>
          <span className={styles.startBtn}>Start →</span>
        </div>
      </div>
    </article>
  );
}
