import { useMemo } from "react";
import { ServiceStatus } from "../../../services/service.js";
import { colors } from "../../colors.js";
import { Box, Text } from "ink";

export const StatusBadge = ({ status }: { status: ServiceStatus }) => {
  const color = useMemo(() => {
    if (status === "running") {
      return colors.success;
    }

    if (status === "failed") {
      return colors.error;
    }

    if (status === "stopped") {
      return colors.muted;
    }

    return colors.warning;
  }, [status]);

  return (
    <Box flexDirection="row">
      <Text color={color}>◉ </Text>
      <Text>{status}</Text>
    </Box>
  );
};
