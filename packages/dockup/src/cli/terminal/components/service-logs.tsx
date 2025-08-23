import { Box } from "ink";
import { ComponentProps, useEffect, useState } from "react";
import { Scrollbar } from "./scrollbar.js";
import { Service } from "../../../services/service.js";

export const ContainerLogs = ({
  service,
  ...props
}: ComponentProps<typeof Box> & { service: Service; height: number }) => {
  const [logs, setLogs] = useState<string>("");

  useEffect(() => {
    function handleData(chunk: Buffer) {
      setLogs((logs) => logs + chunk.toString());
    }

    service.logs.on("data", handleData);

    return () => {
      service.logs.off("data", handleData);
    };
  }, [service]);

  return <Scrollbar paddingX={1} logs={logs} {...props} />;
};
