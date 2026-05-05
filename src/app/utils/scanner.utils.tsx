import { useEffect, useRef } from "react";

const MIN_SCANNER_LENGTH = 4;
const MAX_SCANNER_KEYSTROKE_DELAY = 50;

export function useIotScanner(onScan: (value: string) => void) {
  const buffer = useRef("");
  const lastKeyTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();

      if (e.key === "Enter") {
        const value = buffer.current.trim();
        if (value.length >= MIN_SCANNER_LENGTH) {
          e.preventDefault();
          e.stopPropagation();
          onScan(value);
        }
        buffer.current = "";
        lastKeyTime.current = 0;
        return;
      }

      if (now - lastKeyTime.current > MAX_SCANNER_KEYSTROKE_DELAY) {
        buffer.current = "";
      }
      lastKeyTime.current = now;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onScan]);
}

