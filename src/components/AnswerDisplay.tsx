import styles from '../App.module.css';

interface Props {
  answer: string | null;
}

export default function AnswerDisplay({ answer }: Props) {
  if (answer === null) return null;
  return <div className={styles.answer}>{answer}</div>;
}
