// Category and difficulty configuration shared across the app

export const CATEGORY_CONFIG = {
  'IRE & Reconciliation': {
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #a435f0, #c56af5)',
    color: '#c56af5',
    bg: 'rgba(164, 53, 240, 0.14)'
  },
  'CMDB Health & Dashboards': {
    icon: '📊',
    gradient: 'linear-gradient(135deg, #1db954, #1ed760)',
    color: '#1db954',
    bg: 'rgba(29, 185, 84, 0.14)'
  },
  'CMDB Data Manager & Governance': {
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #f69c08, #ffb347)',
    color: '#f69c08',
    bg: 'rgba(246, 156, 8, 0.14)'
  },
  'CSDM & Lifecycle': {
    icon: '🏗️',
    gradient: 'linear-gradient(135deg, #61dafb, #00b4d8)',
    color: '#61dafb',
    bg: 'rgba(97, 218, 251, 0.14)'
  },
  'Ingest & Integrations': {
    icon: '🔌',
    gradient: 'linear-gradient(135deg, #ff5722, #ff8a65)',
    color: '#ff7043',
    bg: 'rgba(255, 87, 34, 0.14)'
  },
  'CMDB Workspace & Query Builder': {
    icon: '🔍',
    gradient: 'linear-gradient(135deg, #00bcd4, #26c6da)',
    color: '#26c6da',
    bg: 'rgba(0, 188, 212, 0.14)'
  },
  'Mixed': {
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #a435f0, #f69c08)',
    color: '#a435f0',
    bg: 'rgba(164, 53, 240, 0.14)'
  }
};

export const DIFFICULTY_CONFIG = {
  easy:   { color: '#1db954', bg: 'rgba(29,185,84,0.12)',  label: 'Easy' },
  medium: { color: '#f69c08', bg: 'rgba(246,156,8,0.12)', label: 'Medium' },
  hard:   { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)', label: 'Hard' },
};

export const RESULT_CONFIG = [
  { min: 90, emoji: '🏆', title: 'Outstanding!',     subtitle: "You've mastered CIS-DF — exceptional performance!" },
  { min: 75, emoji: '🎉', title: 'Great Job!',        subtitle: 'Solid understanding of CMDB & CSDM fundamentals. Keep it up!' },
  { min: 55, emoji: '📚', title: 'Good Effort!',      subtitle: "You're on the right path. Review the explanations to reinforce key concepts." },
  { min: 35, emoji: '💪', title: 'Keep Going!',       subtitle: "Don't give up — review the material and try again." },
  { min: 0,  emoji: '🌱', title: 'Room to Grow!',     subtitle: 'Review the question explanations and take another round!' },
];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getDominantDifficulty(questions) {
  const counts = {};
  questions.forEach(q => { counts[q.difficulty] = (counts[q.difficulty] || 0) + 1; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'medium';
}

export function buildQuizSets(allQuestions) {
  const sets = [];

  // Full mixed quiz
  sets.push({
    id: 'full',
    title: 'Complete CIS-DF Certification Exam',
    description: 'Comprehensive practice exam covering IRE, CMDB Health, Data Manager, CSDM, Integrations, and CMDB Workspace.',
    category: 'Mixed',
    questions: shuffle(allQuestions),
    timePerQ: 45,
    featured: true,
  });

  // Per-category quizzes
  const categoryDescriptions = {
    'IRE & Reconciliation': 'Master Identification Rules, Reconciliation Rules, Dynamic Reconciliation, and De-duplication logic.',
    'CMDB Health & Dashboards': 'Test your knowledge on Completeness, Correctness, Compliance KPIs, Staleness, and Inclusion Rules.',
    'CMDB Data Manager & Governance': 'Learn lifecycle policies: Attestation, Certification, Archive, Retire, and Delete governance.',
    'CSDM & Lifecycle': 'Understand Common Service Data Model domains, Life Cycle Stages, Information Objects, and Service Offerings.',
    'Ingest & Integrations': 'Explore Discovery phases, Service Mapping, ACC, Service Graph Connectors, and IntegrationHub ETL.',
    'CMDB Workspace & Query Builder': 'Practice Unified Map, Intelligent Search (NLQ), CMDB 360, and Query Builder combinations.'
  };

  const cats = [...new Set(allQuestions.map(q => q.category))];
  cats.forEach(cat => {
    const qs = allQuestions.filter(q => q.category === cat);
    if (qs.length >= 2) {
      sets.push({
        id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: `${cat}`,
        description: categoryDescriptions[cat] || `Practice ${qs.length} curated questions on ${cat}.`,
        category: cat,
        questions: qs,
        timePerQ: 40,
        featured: false,
      });
    }
  });

  return sets;
}
