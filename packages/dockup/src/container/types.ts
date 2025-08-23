export type ContainerPort = {
  name?: string;
  containerPort: number;
  targetPort: number;
};

export type ContainerStatus =
  | "stopped"
  | "starting"
  | "running"
  | "stopping"
  | "restarting";

export type ContainerEvents = {
  status: (status: ContainerStatus) => void;
};
