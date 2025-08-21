"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <motion.span
      className="text-lg font-mono font-bold mr-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayed}
      {/* Blinking cursor */}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        |
      </motion.span>
    </motion.span>
  );
}
