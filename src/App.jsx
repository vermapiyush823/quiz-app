import styles from './App.module.css';
import { useQuiz } from './context/QuizContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import QuizPage from './components/QuizPage/QuizPage';
import ResultsPage from './components/ResultsPage/ResultsPage';
import QuickLearning from './components/QuickLearning/QuickLearning';

export default function App() {
  const { state } = useQuiz();
  const { page } = state;

  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        {page === 'home'           && <HomePage />}
        {page === 'quiz'           && <QuizPage />}
        {page === 'results'        && <ResultsPage />}
        {page === 'quick-learning' && <QuickLearning />}
      </main>
    </div>
  );
}
