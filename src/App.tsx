import { useState } from "react";
import styles from "./App.module.css";
import QuestionForm from "./components/QuestionForm";
import AnswerDisplay from "./components/AnswerDisplay";

export default function App() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(question: string) {
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { answer: string };
      setAnswer(data.answer);
    } catch {
      setAnswer("ムキー");
    } finally {
      setLoading(false);
    }
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
