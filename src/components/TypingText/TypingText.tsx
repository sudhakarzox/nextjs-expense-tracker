"use client";
import styles from "./TypingText.module.css";
import { useEffect, useState } from "react";

interface TypingProps {
  text: string;
  speed?: number;
  once?: boolean;
}

export function TypingText({ text, speed = 100, once = true }: TypingProps) {
  const [displayed, setDisplayed] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (once && finished) return; // prevent re-running if once = true

    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length-1) {
        clearInterval(interval);
        setFinished(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, once, finished]);

  return (
    
    <span className={styles.typing}>
      {displayed}
      <span className={styles.cursor}>|</span>
    </span>
  );
}
