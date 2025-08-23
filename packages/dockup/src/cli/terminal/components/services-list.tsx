import { Box, DOMElement, Text, useInput } from "ink";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { colors } from "../../utils.js";
import { Service, ServiceStatus } from "../../../services/service.js";
import { Help } from "./help.js";
import { StatusBadge } from "./status-badge.js";

export const ServicesList = ({
  services,
  value,
  onChange,
  ...props
}: ComponentProps<typeof Box> & {
  services: Service[];
  value: number;
  onChange: (value: number) => void;
}) => {
  const service = useMemo(() => services[value], [services, value]);

  useInput((input, key) => {
    if (input === "j" || key.downArrow) {
      return select(value + 1);
    }

    if (input === "k" || key.upArrow) {
      return select(value - 1);
    }

    if (input === "r") {
      service.restart();
    }

    if (input === "s") {
      if (service.status === "running") {
        service.stop();
      } else {
        service.start();
      }
    }
  });

  function select(index: number) {
    if (!services[index]) return;
    onChange(index);
  }

  return (
    <Box
      paddingX={1}
      flexDirection="column"
      borderBottomColor={colors.primary}
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      borderStyle="single"
      {...props}
    >
      <Box flexDirection="row" marginBottom={1} paddingX={1}>
        <Box flexBasis="25%">
          <Text bold>Status</Text>
        </Box>
        <Box flexBasis="25%">
          <Text bold>Name</Text>
        </Box>
        <Box flexBasis="25%">
          <Text bold>Service</Text>
        </Box>
        <Box flexBasis="25%">
          <Text bold>Type</Text>
        </Box>
      </Box>

      {services.map((service, index) => (
        <ContainerRow
          key={index}
          service={service}
          isSelected={value === index}
        />
      ))}

      <Help
        marginTop={1}
        items={[
          {
            icon: "↑↓/jk",
            label: "navigate",
          },
          {
            icon: "r",
            label: "restart",
          },
          {
            icon: "s",
            label: "stop/start",
          },
        ]}
      />
    </Box>
  );
};

const ContainerRow = ({
  service,
  isSelected,
}: {
  service: Service;
  isSelected: boolean;
}) => {
  const [status, setStatus] = useState<ServiceStatus>();

  const ref = useRef<DOMElement>(null);

  useEffect(() => {
    return service.hook("status", (status) => setStatus(status));
  }, []);

  return (
    <Box
      flexDirection="row"
      backgroundColor={isSelected ? colors.primary : undefined}
      paddingX={1}
      ref={ref}
    >
      <Box flexBasis={"25%"}>
        <StatusBadge status={status || service.status} />
      </Box>
      <Box flexBasis={"25%"}>
        <Text color={isSelected ? colors.onPrimary : undefined}>
          {service.id}
        </Text>
      </Box>
      <Box flexBasis={"25%"}>
        <Text color={isSelected ? colors.onPrimary : undefined}>
          {service.name}
        </Text>
      </Box>
      <Box flexBasis={"25%"}>
        <Text color={isSelected ? colors.onPrimary : undefined}>
          {service.kind}
        </Text>
      </Box>
    </Box>
  );
};
