import { useState } from 'react';
import styles from '../App.module.css';

interface Props {
  onSubmit: (question: string) => void;
  disabled: boolean;
}

export default function QuestionForm({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="質問を入力してください"
      />
      <button
        className={styles.button}
        type="submit"
        disabled={disabled || !value.trim()}
      >
        送信
      </button>
    </form>
  );
}
