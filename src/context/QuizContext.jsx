import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { shuffle, buildQuizSets } from '../utils/constants';

// ─── State Shape ──────────────────────────────────────────────
const initialState = {
  page: 'home',          // 'home' | 'quiz' | 'results'
  allQuestions: [],
  quizSets: [],
  loading: true,
  error: null,

  // Active quiz
  activeQuiz: null,
  currentIndex: 0,
  answers: [],           // null | { selectedIndices: number[], isCorrect: boolean, timeSpent: number }
  pendingSelections: [], // number[] for currently toggled checkboxes before submit
  revealed: false,
  timeLeft: 45,
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

    case 'START_QUIZ':
      return {
        ...state,
        page: 'quiz',
        activeQuiz: action.quiz,
        currentIndex: 0,
        answers: new Array(action.quiz.questions.length).fill(null),
        pendingSelections: [],
        revealed: false,
        timeLeft: action.quiz.timePerQ,
        quizStartTime: Date.now(),
      };

    case 'TOGGLE_OPTION': {
      if (state.revealed) return state;
      const q = state.activeQuiz.questions[state.currentIndex];
      const isMulti = q.multiSelect || (q.correctIndices && q.correctIndices.length > 1);

      if (!isMulti) {
        // Single choice: immediately submit
        const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
        const isCorrect = arraysEqual([action.index], targetIndices);
        const timeSpent = state.activeQuiz.timePerQ - state.timeLeft;

        const newAnswers = [...state.answers];
        newAnswers[state.currentIndex] = {
          selectedIndices: [action.index],
          isCorrect,
          timeSpent,
        };

        return {
          ...state,
          pendingSelections: [action.index],
          revealed: true,
          answers: newAnswers,
        };
      } else {
        // Multi-select toggle
        const exists = state.pendingSelections.includes(action.index);
        const updated = exists
          ? state.pendingSelections.filter(i => i !== action.index)
          : [...state.pendingSelections, action.index];

        return { ...state, pendingSelections: updated };
      }
    }

    case 'SUBMIT_MULTI_ANSWER': {
      if (state.revealed) return state;
      const q = state.activeQuiz.questions[state.currentIndex];
      const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
      const isCorrect = arraysEqual(state.pendingSelections, targetIndices);
      const timeSpent = state.activeQuiz.timePerQ - state.timeLeft;

      const newAnswers = [...state.answers];
      newAnswers[state.currentIndex] = {
        selectedIndices: [...state.pendingSelections],
        isCorrect,
        timeSpent,
      };

      return {
        ...state,
        revealed: true,
        answers: newAnswers,
      };
    }

    case 'NEXT_QUESTION': {
      if (state.currentIndex < state.activeQuiz.questions.length - 1) {
        const nextIdx = state.currentIndex + 1;
        const nextAns = state.answers[nextIdx];
        return {
          ...state,
          currentIndex: nextIdx,
          pendingSelections: nextAns ? nextAns.selectedIndices : [],
          revealed: nextAns !== null,
          timeLeft: state.activeQuiz.timePerQ,
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
          revealed: prevAns !== null,
          timeLeft: state.activeQuiz.timePerQ,
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
        revealed: targetAns !== null,
        timeLeft: state.activeQuiz.timePerQ,
      };
    }

    case 'TICK_TIMER':
      if (state.timeLeft <= 1) {
        // Time up
        if (!state.revealed) {
          const q = state.activeQuiz.questions[state.currentIndex];
          const targetIndices = q.correctIndices || [q.correctIndex ?? 0];
          const isCorrect = arraysEqual(state.pendingSelections, targetIndices) && state.pendingSelections.length > 0;
          const newAnswers = [...state.answers];
          newAnswers[state.currentIndex] = {
            selectedIndices: [...state.pendingSelections],
            isCorrect,
            timeSpent: state.activeQuiz.timePerQ,
          };
          return { ...state, timeLeft: 0, revealed: true, answers: newAnswers };
        }
        return { ...state, timeLeft: 0 };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'FINISH_QUIZ':
      return { ...state, page: 'results' };

    case 'GO_HOME':
      return { ...initialState, allQuestions: state.allQuestions, quizSets: state.quizSets, loading: false, page: 'home' };

    case 'GO_QUICK_LEARNING':
      return { ...state, page: 'quick-learning' };

    case 'RESTART_QUIZ': {
      const quiz = { ...state.activeQuiz, questions: state.activeQuiz.id === 'full' ? shuffle(state.allQuestions) : state.activeQuiz.questions };
      return {
        ...state,
        page: 'quiz',
        activeQuiz: quiz,
        currentIndex: 0,
        answers: new Array(quiz.questions.length).fill(null),
        pendingSelections: [],
        revealed: false,
        timeLeft: quiz.timePerQ,
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
    if (state.page === 'quiz' && !state.revealed) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [state.page, state.currentIndex, state.revealed]);

  const startQuiz = useCallback((quizId) => {
    const quiz = state.quizSets.find(s => s.id === quizId);
    if (quiz) dispatch({ type: 'START_QUIZ', quiz });
  }, [state.quizSets]);

  const toggleOption = useCallback((index) => {
    dispatch({ type: 'TOGGLE_OPTION', index });
  }, []);

  const submitMultiAnswer = useCallback(() => {
    dispatch({ type: 'SUBMIT_MULTI_ANSWER' });
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
      startQuiz,
      toggleOption,
      submitMultiAnswer,
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
