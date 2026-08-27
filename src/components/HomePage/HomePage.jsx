import { useState } from 'react';
import styles from './HomePage.module.css';
import QuizCard from '../QuizCard/QuizCard';
import { useQuiz } from '../../context/QuizContext';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, getDominantDifficulty } from '../../utils/constants';

const ALL = 'All';

export default function HomePage() {
  const { state, startQuiz, goToQuickLearning } = useQuiz();
  const { quizSets, loading, error } = state;

  const [activeFilter, setActiveFilter] = useState(ALL);

  const featured = quizSets.find(s => s.featured);
  const nonFeatured = quizSets.filter(s => !s.featured);

  const categories = [ALL, ...new Set(nonFeatured.map(s => s.category))];

  const filtered = activeFilter === ALL
    ? nonFeatured
    : nonFeatured.filter(s => s.category === activeFilter);

  if (error) {
    return (
      <div className={styles.errorBox}>
        <span style={{ fontSize: 48 }}>⚠️</span>
        <p>Could not load questions. Please refresh the page.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Hero ─────────────────────────────────── */}
      <section className={`${styles.hero} animate-fadeInUp`}>
        <div className={styles.heroBadge}>🎯 ServiceNow CIS-DF Exam Practice</div>
        <h1 className={styles.heroTitle}>
          Certified Implementation Specialist<br />
          <span className={styles.heroGradient}>Data Foundations (CIS-DF)</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Master the ServiceNow CMDB and CSDM with 153 comprehensive exam questions, multi-select scenarios, detailed explanations, and category quizzes.
        </p>
        <div className={styles.heroActions}>
          <button className="btn btn-primary btn-lg" onClick={() => startQuiz('full')}>
            🚀 Start Full Exam (153 Qs)
          </button>
          <button className="btn btn-secondary btn-lg" onClick={goToQuickLearning}>
            ⚡ Quick Learning Cheat Sheet
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => document.getElementById('quiz-sets').scrollIntoView({ behavior: 'smooth' })}
          >
            Browse By Category ↓
          </button>
        </div>

        <div className={styles.heroStats}>
          {[
            { val: '153', label: 'Exam Questions' },
            { val: '6',   label: 'Domains' },
            { val: '29',  label: 'Multi-Select Qs' },
            { val: '100%', label: 'Free' },
          ].map((s, i) => (
            <div key={i} className={styles.statBlock}>
              {i > 0 && <div className={styles.statDivider} />}
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Quiz ─────────────────────────── */}
      {featured && (
        <section className={`${styles.featuredWrapper} animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
          <FeaturedQuiz set={featured} onStart={startQuiz} />
        </section>
      )}

      {/* ── Quiz Cards ────────────────────────────── */}
      <section id="quiz-sets" className={styles.quizSetsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse Quizzes</h2>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${activeFilter === cat ? styles.chipActive : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat !== ALL && CATEGORY_CONFIG[cat] ? CATEGORY_CONFIG[cat].icon + ' ' : '🌐 '}{cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((set, i) => (
              <QuizCard key={set.id} set={set} onStart={startQuiz} delay={i * 0.05} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedQuiz({ set, onStart }) {
  const conf = CATEGORY_CONFIG[set.category] || CATEGORY_CONFIG['Mixed'];
  const difficulty = getDominantDifficulty(set.questions);
  const diffConf = DIFFICULTY_CONFIG[difficulty];
  const minutes = Math.ceil((set.questions.length * set.timePerQ) / 60);

  return (
    <div className={styles.featured}>
      <div className={styles.featuredTopLine} />
      <div className={styles.featuredContent}>
        <div className={styles.featuredLabel}>⭐ Featured Quiz</div>
        <h2 className={styles.featuredTitle}>{set.title}</h2>
        <p className={styles.featuredDesc}>{set.description}</p>
        <div className={styles.featuredMeta}>
          <span className={styles.metaItem}>📝 {set.questions.length} Questions</span>
          <span className={styles.metaItem}>⏱️ ~{minutes} min</span>
          <span className={styles.metaItem} style={{ color: diffConf.color }}>● {diffConf.label}</span>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => onStart(set.id)}>
          🚀 Start Full Quiz
        </button>
      </div>
      <div className={styles.featuredVisual}>{conf.icon}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className="skeleton" style={{ height: 8 }} />
      <div style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
      </div>
    </div>
  );
}
