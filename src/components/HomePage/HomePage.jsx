import { useState } from 'react';
import styles from './HomePage.module.css';
import QuizCard from '../QuizCard/QuizCard';
import ModeModal from '../ModeModal/ModeModal';
import { useQuiz } from '../../context/QuizContext';
import { CATEGORY_CONFIG, formatTime } from '../../utils/constants';

const ALL = 'All';
const EXAM_SETS = 'Exam Sets';
const DOMAINS = 'Domain Quizzes';

export default function HomePage() {
  const { state, openModeModal, startQuiz, resumeSavedQuiz, discardSavedQuiz, goToQuickLearning } = useQuiz();
  const { quizSets, loading, error, savedSession } = state;

  const [activeFilter, setActiveFilter] = useState(ALL);

  const examSets = quizSets.filter(s => s.isExamSet);
  const domainSets = quizSets.filter(s => !s.isExamSet);

  const categories = [
    ALL,
    EXAM_SETS,
    DOMAINS,
    ...new Set(domainSets.map(s => s.category))
  ];

  let filtered = quizSets;
  if (activeFilter === EXAM_SETS) {
    filtered = examSets;
  } else if (activeFilter === DOMAINS) {
    filtered = domainSets;
  } else if (activeFilter !== ALL) {
    filtered = domainSets.filter(s => s.category === activeFilter);
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <span style={{ fontSize: 48 }}>⚠️</span>
        <p>Could not load questions. Please refresh the page.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const set1 = quizSets.find(s => s.id === 'set-1');
  const set2 = quizSets.find(s => s.id === 'set-2');

  return (
    <div className={styles.page}>
      <ModeModal />

      {/* ── In-Progress / Incomplete Exam Saved Banner ─────────── */}
      {savedSession && (
        <div className={`${styles.resumeBanner} animate-fadeInUp`}>
          <div className={styles.resumeGlow} />
          <div className={styles.resumeContent}>
            <div className={styles.resumeLeft}>
              <div className={styles.resumeIconBadge}>⏳</div>
              <div>
                <div className={styles.resumeTag}>
                  Incomplete Session Saved • {savedSession.mode === 'exam' ? '⏱️ Real Exam Mode' : '⚡ Practice Mode'}
                </div>
                <h3 className={styles.resumeTitle}>{savedSession.quizTitle || 'In-Progress Exam Session'}</h3>
                <p className={styles.resumeMeta}>
                  <span>Progress: <strong>{savedSession.answeredCount || 0} / {savedSession.totalQuestions || 80}</strong> answered</span>
                  <span>● Resume at Question <strong>{(savedSession.currentIndex || 0) + 1}</strong></span>
                  {savedSession.mode === 'exam' && (
                    <span>● Time Left: <strong>{formatTime(savedSession.examTimeLeft || 5400)}</strong></span>
                  )}
                </p>
              </div>
            </div>

            <div className={styles.resumeActions}>
              <button className="btn btn-primary" onClick={resumeSavedQuiz}>
                ▶️ Resume Exam
              </button>
              <button className={styles.discardBtn} onClick={discardSavedQuiz} title="Clear saved progress">
                🗑️ Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────── */}
      <section className={`${styles.hero} animate-fadeInUp`}>
        <div className={styles.heroBadge}>🎯 ServiceNow CIS-DF Exam Preparation</div>
        <h1 className={styles.heroTitle}>
          Certified Implementation Specialist<br />
          <span className={styles.heroGradient}>Data Foundations (CIS-DF)</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Master the ServiceNow CMDB &amp; CSDM with 160 exam questions divided into two balanced 80-question mock exams, multi-select scenarios, rich explanations, and real exam simulations.
        </p>

        {/* Hero Quick Start Actions */}
        <div className={styles.heroActions}>
          <button className="btn btn-primary btn-lg" onClick={() => openModeModal('set-1')}>
            🚀 Practice Exam 1 (80 Qs)
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => openModeModal('set-2')}>
            🎯 Practice Exam 2 (80 Qs)
          </button>
          <button className="btn btn-ghost btn-lg" onClick={goToQuickLearning}>
            ⚡ Quick Learning Cheat Sheet
          </button>
        </div>

        <div className={styles.heroStats}>
          {[
            { val: '160', label: 'Exam Questions' },
            { val: '2',   label: '80-Q Exam Sets' },
            { val: '2',   label: 'Test Modes' },
            { val: '6',   label: 'Domain Quizzes' },
          ].map((s, i) => (
            <div key={i} className={styles.statBlock}>
              {i > 0 && <div className={styles.statDivider} />}
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Exam Sets Highlight (Udemy-Style) ──────── */}
      <section className={styles.examSetsShowcase}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionSubBadge}>📝 Udemy-Style Test Modes</span>
            <h2 className={styles.sectionTitle}>Full-Length Practice Exams</h2>
          </div>
          <p className={styles.sectionHeaderDesc}>
            Choose between <strong>⚡ Practice Mode</strong> (instant answers &amp; explanations) or <strong>⏱️ Real Exam Mode</strong> (timed simulation with score report at the end).
          </p>
        </div>

        <div className={styles.examGrid}>
          {/* Exam Set 1 */}
          {set1 && (
            <div className={styles.featuredExamCard}>
              <div className={styles.examCardGlow} style={{ background: 'linear-gradient(135deg, #a435f0, #c56af5)' }} />
              <div className={styles.examCardBody}>
                <div className={styles.examCardTop}>
                  <span className={styles.examPill}>Set 1 of 2</span>
                  <span className={styles.examTimeTag}>⏱️ ~95 min</span>
                </div>
                <h3 className={styles.examCardTitle}>{set1.title}</h3>
                <p className={styles.examCardDesc}>{set1.description}</p>
                <div className={styles.examCardMeta}>
                  <span>📝 80 Questions</span>
                  <span>● 70% Pass Mark</span>
                  <span>● IRE, Health &amp; CSDM</span>
                </div>
                <div className={styles.examCardButtons}>
                  <button className="btn btn-secondary" onClick={() => startQuiz('set-1', 'practice')}>
                    ⚡ Practice Mode (Instant)
                  </button>
                  <button className="btn btn-primary" onClick={() => startQuiz('set-1', 'exam')}>
                    ⏱️ Real Exam Simulation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exam Set 2 */}
          {set2 && (
            <div className={styles.featuredExamCard}>
              <div className={styles.examCardGlow} style={{ background: 'linear-gradient(135deg, #f69c08, #ffb347)' }} />
              <div className={styles.examCardBody}>
                <div className={styles.examCardTop}>
                  <span className={styles.examPill} style={{ background: 'rgba(246, 156, 8, 0.15)', color: '#ffc85e' }}>Set 2 of 2</span>
                  <span className={styles.examTimeTag}>⏱️ ~95 min</span>
                </div>
                <h3 className={styles.examCardTitle}>{set2.title}</h3>
                <p className={styles.examCardDesc}>{set2.description}</p>
                <div className={styles.examCardMeta}>
                  <span>📝 80 Questions</span>
                  <span>● 70% Pass Mark</span>
                  <span>● Governance, Ingestion &amp; 5.0</span>
                </div>
                <div className={styles.examCardButtons}>
                  <button className="btn btn-secondary" onClick={() => startQuiz('set-2', 'practice')}>
                    ⚡ Practice Mode (Instant)
                  </button>
                  <button className="btn btn-primary" onClick={() => startQuiz('set-2', 'exam')}>
                    ⏱️ Real Exam Simulation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── All Quizzes & Domain Drills ────────────── */}
      <section id="quiz-sets" className={styles.quizSetsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Browse All Tests &amp; Domain Drills</h2>
            <p className={styles.sectionHeaderDesc}>Practice specific CIS-DF knowledge areas or complete full exams.</p>
          </div>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${activeFilter === cat ? styles.chipActive : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat === ALL && '🌐 '}
                {cat === EXAM_SETS && '📝 '}
                {cat === DOMAINS && '🎯 '}
                {CATEGORY_CONFIG[cat] ? CATEGORY_CONFIG[cat].icon + ' ' : ''}
                {cat}
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
              <QuizCard key={set.id} set={set} delay={i * 0.04} />
            ))}
          </div>
        )}
      </section>
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
