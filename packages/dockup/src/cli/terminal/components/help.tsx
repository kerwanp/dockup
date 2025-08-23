import { Box, Text } from "ink";
import { ComponentProps } from "react";
import { colors } from "../colors.js";

export const Help = ({
  items,
  ...props
}: ComponentProps<typeof Box> & {
  items: { icon: string; label: string }[];
}) => (
  <Box flexDirection="row" {...props}>
    {items.map((item, index) => (
      <Box flexDirection="row" key={item.label}>
        <Text color={colors.secondary}>{item.icon} </Text>
        <Text color={colors.muted}>{item.label}</Text>
        {index != items.length - 1 ? (
          <Text color={colors.muted}> • </Text>
        ) : null}
      </Box>
    ))}
  </Box>
);
