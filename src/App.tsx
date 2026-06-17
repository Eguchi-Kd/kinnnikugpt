import { useState } from "react";
import styles from "./App.module.css";
import QuestionForm from "./components/QuestionForm";
import AnswerDisplay from "./components/AnswerDisplay";
import { getMockAnswer } from "./utils/mockAnswer";

export default function App() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(question: string) {
    setLoading(true);
    setAnswer(null);
    setTimeout(() => {
      setAnswer(getMockAnswer(question));
      setLoading(false);
    }, 400);
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.header}>
        <span className={styles.headerAccent}>筋肉</span>GPT
      </h1>
      <QuestionForm onSubmit={handleSubmit} disabled={loading} />
      {loading && <p className={styles.loading}>...</p>}
      <AnswerDisplay answer={answer} />
    </main>
  );
}
