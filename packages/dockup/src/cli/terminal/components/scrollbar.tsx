import { Box, DOMElement, Text } from "ink";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMouse } from "@zenobius/ink-mouse";
import { useDimensions } from "../hooks/use_dimensions.js";

const sanitizeLogs = (logs: string) => {
  return (
    logs
      // Remove ANSI escape sequences (colors, cursor movement, etc.)
      .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "")
      // Remove other escape sequences like window title
      .replace(/\x1b\][^\x07]*\x07/g, "")
      // Remove control characters except \r, \n, \t
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Replace tabs with spaces for consistent display
      .replace(/\t/g, "    ")
      // Remove any remaining problematic unicode control characters
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
  );
};

const wrapText = (text: string, width: number) => {
  const lines = [];

  for (const line of text.split("\n")) {
    if (line.length > width) {
      lines.push(line.slice(0, width), line.slice(width));
    } else {
      lines.push(line);
    }
  }

  return lines.join("\n");
};

function transformLogs(logs: string, columns: number) {
  return wrapText(sanitizeLogs(logs), columns);
}

export const Scrollbar = ({
  children,
  height,
  logs,
  autoscroll = true,
  ...props
}: ComponentProps<typeof Box> & {
  logs: string;
  height: number;
  autoscroll?: boolean;
}) => {
  const [columns] = useDimensions();
  const [position, setPosition] = useState(0);
  const mouse = useMouse();

  const ref = useRef<DOMElement>(null);

  const lines = transformLogs(logs, columns - 4).split(/\r\n|\r|\n/);
  const slices = lines.slice(position, height + position - 2);
  const max = Math.max(0, lines.length - height);

  const scrollup = useCallback(() => {
    setPosition((p) => Math.max(0, p - 4));
  }, []);

  const scrolldown = useCallback(() => {
    setPosition((p) => {
      return Math.min(max, p + 4);
    });
  }, [max, height]);

  useEffect(() => {
    function handleScroll(_: any, direction: "scrolldown" | "scrollup" | null) {
      if (direction === "scrolldown") {
        scrolldown();
      }

      if (direction === "scrollup") {
        scrollup();
      }
    }

    mouse.events.on("scroll", handleScroll);
    return () => {
      mouse.events.off("scroll", handleScroll);
    };
  }, [scrolldown, scrollup]);

  useEffect(() => {
    if (autoscroll) {
      setPosition(max);
    }
  }, [autoscroll, max]);

  return (
    <Box ref={ref} height={height} {...props}>
      <Box
        height={height}
        flexGrow={1}
        overflowX="hidden"
        overflowY="hidden"
        flexDirection="column"
      >
        <Text>
          {slices.map((line) => line.substring(0, columns - 4)).join("\n")}
        </Text>
      </Box>
    </Box>
  );
};
