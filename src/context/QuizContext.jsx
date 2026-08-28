import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { shuffle, buildQuizSets } from '../utils/constants';

// ─── State Shape ──────────────────────────────────────────────
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('quiz_theme');
    if (saved) return saved;
  }
  return 'dark';
};

const initialState = {
  theme: getInitialTheme(),
  page: 'home',          // 'home' | 'quiz' | 'results' | 'quick-learning'
  mode: 'practice',      // 'practice' (instant answers) | 'exam' (real test, answers at end)
  allQuestions: [],
  quizSets: [],
  loading: true,
  error: null,

  // Selected quiz setup
  selectedQuizId: null,
  showModeModal: false,

  // Active quiz
  activeQuiz: null,
  currentIndex: 0,
  answers: [],           // null | { selectedIndices: number[], isCorrect: boolean, timeSpent: number }
  pendingSelections: [], // number[]
  flags: [],             // boolean[] tracking 'Marked for Review' in exam mode
  revealed: false,       // true only in practice mode after answering
  timeLeft: 60,          // per-question timer for practice mode
  examTimeLeft: 5400,    // overall seconds for real exam mode
  quizStartTime: null,
};

function arraysEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

// ─── Reducer ─────────────────────────────────────────────────
function quizReducer(state, action) {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        allQuestions: action.questions,
        quizSets: buildQuizSets(action.questions),
      };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };

    case 'OPEN_MODE_MODAL':
      return {
        ...state,
        selectedQuizId: action.quizId,
        showModeModal: true,
      };

    case 'CLOSE_MODE_MODAL':
      return {
        ...state,
        showModeModal: false,
      };

    case 'START_QUIZ': {
      const mode = action.mode || 'practice';
      const quiz = action.quiz;
      const qCount = quiz.questions.length;
      const totalExamSeconds = (quiz.totalTimeMins || 90) * 60;

      return {
        ...state,
        page: 'quiz',
        mode,
        activeQuiz: quiz,
        currentIndex: 0,
        answers: new Array(qCount).fill(null),
        pendingSelections: [],
        flags: new Array(qCount).fill(false),
        revealed: false,
        timeLeft: quiz.timePerQ || 60,
        examTimeLeft: totalExamSeconds,
        quizStartTime: Date.now(),
        showModeModal: false,
      };
    }

    case 'TOGGLE_OPTION': {
      const q = state.activeQuiz.questions[state.currentIndex];
      const isMulti = q.multiSelect || (q.correctIndices && q.correctIndices.length > 1);
      const targetIndices = q.correctIndices || [q.correctIndex ?? 0];

      if (state.mode === 'practice') {
        if (state.revealed) return state;

        if (!isMulti) {
          // Single choice in practice mode: immediate submit
          const isCorrect = arraysEqual([action.index], targetIndices);
          const timeSpent = (state.activeQuiz.timePerQ || 60) - state.timeLeft;

          const newAnswers = [...state.answers];
          newAnswers[state.currentIndex] = {
            selectedIndices: [action.index],
            isCorrect,
            timeSpent: Math.max(timeSpent, 1),
          };

          return {
            ...state,
            pendingSelections: [action.index],
            revealed: true,
            answers: newAnswers,
          };
        } else {
          // Multi-select toggle before submit
          const exists = state.pendingSelections.includes(action.index);
          const updated = exists
            ? state.pendingSelections.filter(i => i !== action.index)
            : [...state.pendingSelections, action.index];

          return { ...state, pendingSelections: updated };
        }
      } else {
        // EXAM MODE: Selection without immediate reveal
        if (!isMulti) {
          // Single choice in exam mode
          const isCorrect = arraysEqual([action.index], targetIndices);
          const newAnswers = [...state.answers];
          newAnswers[state.currentIndex] = {
            selectedIndices: [action.index],
            isCorrect,
            timeSpent: 0,
          };
          return {
            ...state,
            pendingSelections: [action.index],
            answers: newAnswers,
          };
        } else {
          // Multi-select in exam mode
          const exists = state.pendingSelections.includes(action.index);
          const updated = exists
            ? state.pendingSelections.filter(i => i !== action.index)
            : [...state.pendingSelections, action.index];

          const isCorrect = arraysEqual(updated, targetIndices);
          const newAnswers = [...state.answers];
          newAnswers[state.currentIndex] = updated.length > 0 ? {
            selectedIndices: updated,
            isCorrect,
            timeSpent: 0,
          } : null;

          return {
            ...state,
            pendingSelections: updated,
            answers: newAnswers,
          };
        }
      }
    }

    case 'SUBMIT_MULTI_ANSWER': {
      if (state.revealed) return state;
      const q = state.activeQuiz.questions[state.currentIndex];
      const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
      const isCorrect = arraysEqual(state.pendingSelections, targetIndices);
      const timeSpent = (state.activeQuiz.timePerQ || 60) - state.timeLeft;

      const newAnswers = [...state.answers];
      newAnswers[state.currentIndex] = {
        selectedIndices: [...state.pendingSelections],
        isCorrect,
        timeSpent: Math.max(timeSpent, 1),
      };

      return {
        ...state,
        revealed: true,
        answers: newAnswers,
      };
    }

    case 'TOGGLE_FLAG': {
      const newFlags = [...state.flags];
      newFlags[state.currentIndex] = !newFlags[state.currentIndex];
      return { ...state, flags: newFlags };
    }

    case 'NEXT_QUESTION': {
      if (state.currentIndex < state.activeQuiz.questions.length - 1) {
        const nextIdx = state.currentIndex + 1;
        const nextAns = state.answers[nextIdx];
        return {
          ...state,
          currentIndex: nextIdx,
          pendingSelections: nextAns ? nextAns.selectedIndices : [],
          revealed: state.mode === 'practice' ? nextAns !== null : false,
          timeLeft: state.activeQuiz.timePerQ || 60,
        };
      }
      return state;
    }

    case 'PREV_QUESTION': {
      if (state.currentIndex > 0) {
        const prevIdx = state.currentIndex - 1;
        const prevAns = state.answers[prevIdx];
        return {
          ...state,
          currentIndex: prevIdx,
          pendingSelections: prevAns ? prevAns.selectedIndices : [],
          revealed: state.mode === 'practice' ? prevAns !== null : false,
          timeLeft: state.activeQuiz.timePerQ || 60,
        };
      }
      return state;
    }

    case 'JUMP_QUESTION': {
      const targetAns = state.answers[action.index];
      return {
        ...state,
        currentIndex: action.index,
        pendingSelections: targetAns ? targetAns.selectedIndices : [],
        revealed: state.mode === 'practice' ? targetAns !== null : false,
        timeLeft: state.activeQuiz.timePerQ || 60,
      };
    }

    case 'TICK_TIMER': {
      if (state.mode === 'practice') {
        if (state.timeLeft <= 1) {
          if (!state.revealed) {
            const q = state.activeQuiz.questions[state.currentIndex];
            const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
            const isCorrect = arraysEqual(state.pendingSelections, targetIndices) && state.pendingSelections.length > 0;
            const newAnswers = [...state.answers];
            newAnswers[state.currentIndex] = {
              selectedIndices: [...state.pendingSelections],
              isCorrect,
              timeSpent: state.activeQuiz.timePerQ || 60,
            };
            return { ...state, timeLeft: 0, revealed: true, answers: newAnswers };
          }
          return { ...state, timeLeft: 0 };
        }
        return { ...state, timeLeft: state.timeLeft - 1 };
      } else {
        // Exam mode countdown
        if (state.examTimeLeft <= 1) {
          // Time's up in exam! Auto finish
          return { ...state, examTimeLeft: 0, page: 'results' };
        }
        return { ...state, examTimeLeft: state.examTimeLeft - 1 };
      }
    }

    case 'TOGGLE_THEME': {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('quiz_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
      return { ...state, theme: nextTheme };
    }

    case 'FINISH_QUIZ':
      return { ...state, page: 'results' };

    case 'GO_HOME':
      return { ...initialState, allQuestions: state.allQuestions, quizSets: state.quizSets, loading: false, page: 'home' };

    case 'GO_QUICK_LEARNING':
      return { ...state, page: 'quick-learning' };

    case 'RESTART_QUIZ': {
      const quiz = state.activeQuiz;
      const qCount = quiz.questions.length;
      const totalExamSeconds = (quiz.totalTimeMins || 90) * 60;
      return {
        ...state,
        page: 'quiz',
        activeQuiz: quiz,
        currentIndex: 0,
        answers: new Array(qCount).fill(null),
        pendingSelections: [],
        flags: new Array(qCount).fill(false),
        revealed: false,
        timeLeft: quiz.timePerQ || 60,
        examTimeLeft: totalExamSeconds,
        quizStartTime: Date.now(),
      };
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────
const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timerRef = useRef(null);

  // Load questions on mount
  useEffect(() => {
    fetch('/questions.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(questions => dispatch({ type: 'LOAD_SUCCESS', questions }))
      .catch(err => dispatch({ type: 'LOAD_ERROR', error: err.message }));
  }, []);

  // Timer management
  useEffect(() => {
    clearInterval(timerRef.current);
    if (state.page === 'quiz') {
      if (state.mode === 'practice' && !state.revealed) {
        timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
      } else if (state.mode === 'exam') {
        timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [state.page, state.currentIndex, state.revealed, state.mode]);

  // Initial theme sync on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const openModeModal = useCallback((quizId) => {
    dispatch({ type: 'OPEN_MODE_MODAL', quizId });
  }, []);

  const closeModeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODE_MODAL' });
  }, []);

  const startQuiz = useCallback((quizId, mode = 'practice') => {
    const quiz = state.quizSets.find(s => s.id === quizId);
    if (quiz) dispatch({ type: 'START_QUIZ', quiz, mode });
  }, [state.quizSets]);

  const toggleOption = useCallback((index) => {
    dispatch({ type: 'TOGGLE_OPTION', index });
  }, []);

  const submitMultiAnswer = useCallback(() => {
    dispatch({ type: 'SUBMIT_MULTI_ANSWER' });
  }, []);

  const toggleFlag = useCallback(() => {
    dispatch({ type: 'TOGGLE_FLAG' });
  }, []);

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV_QUESTION' }), []);
  const jumpToQuestion = useCallback((i) => dispatch({ type: 'JUMP_QUESTION', index: i }), []);
  const finishQuiz = useCallback(() => dispatch({ type: 'FINISH_QUIZ' }), []);
  const goHome = useCallback(() => dispatch({ type: 'GO_HOME' }), []);
  const goToQuickLearning = useCallback(() => dispatch({ type: 'GO_QUICK_LEARNING' }), []);
  const restartQuiz = useCallback(() => dispatch({ type: 'RESTART_QUIZ' }), []);

  return (
    <QuizContext.Provider value={{
      state,
      toggleTheme,
      openModeModal,
      closeModeModal,
      startQuiz,
      toggleOption,
      submitMultiAnswer,
      toggleFlag,
      nextQuestion,
      prevQuestion,
      jumpToQuestion,
      finishQuiz,
      goHome,
      goToQuickLearning,
      restartQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider');
  return ctx;
};
