import { Box, render, useInput } from "ink";
import { ContainerLogs } from "./components/service-logs.js";
import { ServicesList } from "./components/services-list.js";
import { useState } from "react";
import { useDimensions } from "./hooks/use_dimensions.js";
import { MouseProvider } from "@zenobius/ink-mouse";
import { colors } from "../colors.js";
import { Dockup } from "../../load_dockup.js";

export const Terminal = ({ dockup }: { dockup: Dockup }) => {
  const [columns, rows] = useDimensions();
  const [selected, setSelected] = useState(0);

  useInput(async (input, key) => {
    if (input === "c" && key.ctrl) {
      process.emit("SIGINT", "SIGINT");
    }
  });

  return (
    <MouseProvider>
      <Box
        flexDirection="column"
        height={rows - 1}
        width={columns}
        borderStyle="round"
        borderColor={colors.primary}
      >
        <ServicesList
          value={selected}
          onChange={setSelected}
          services={dockup.services}
        />
        {dockup.services.map((service, index) => (
          <ContainerLogs
            key={index}
            height={rows - 10}
            display={selected === index ? "flex" : "none"}
            service={service}
          />
        ))}
      </Box>
    </MouseProvider>
  );
};

export async function startTerminal(dockup: Dockup) {
  const instance = render(<Terminal dockup={dockup} />, { exitOnCtrlC: false });

  process.on("SIGINT", async () => {
    await dockup.stop();
    instance.clear();
    process.exit(0);
  });

  await dockup.init();
  await dockup.start();
}
