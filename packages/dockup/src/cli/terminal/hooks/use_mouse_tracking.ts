import { useStdin } from "ink";
import { useEffect } from "react";

export function useMousetracking() {
  const { stdin, setRawMode } = useStdin();
  useEffect(() => {
    const originalRawMode = stdin.isRaw;

    if (setRawMode) {
      setRawMode(true);

      // Enable mouse tracking
      process.stdout.write("\x1b[?1000h");
      process.stdout.write("\x1b[?1002h");
      process.stdout.write("\x1b[?1015h");
      process.stdout.write("\x1b[?1006h");
    }

    return () => {
      // Disable mouse tracking
      process.stdout.write("\x1b[?1006l");
      process.stdout.write("\x1b[?1015l");
      process.stdout.write("\x1b[?1002l");
      process.stdout.write("\x1b[?1000l");

      setRawMode(originalRawMode);
    };
  }, [stdin, setRawMode]);

  useEffect(() => {
    stdin.on("data", (chunk) => {
      console.log(chunk);
    });
  }, [stdin]);
}
