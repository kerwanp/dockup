import { Hookable } from "hookable";
import { PassThrough } from "node:stream";

export type ServiceStatus =
  | "stopped"
  | "initializing"
  | "starting"
  | "running"
  | "stopping"
  | "stopped"
  | "failed"
  | "restarting";

export type ServiceEvents = {
  status: (status: ServiceStatus) => void;
};

export type ServiceOptions = {
  /**
   * Kind of service.
   *
   * @example "container"
   */
  kind: string;

  /**
   * Service name.
   *
   * @example "postgresql"
   */
  name: string;

  /**
   * Service instance name.
   *
   * @example "db-2"
   */
  instance: string;
};

export abstract class Service extends Hookable<ServiceEvents> {
  /**
   * Kind of service.
   */
  abstract kind: string;

  /**
   * Status of the service.
   */
  status: ServiceStatus = "stopped";

  /**
   * Name of the service type.
   */
  name: string;

  /**
   * Service instance id.
   */
  id: string;

  /**
   * PassThrough stream containing logs.
   */
  logs = new PassThrough();

  constructor(name: string, instance: string) {
    super();
    this.name = name;
    this.id = instance;
  }

  abstract init(): Promise<void>;
  abstract start(): Promise<void>;
  abstract restart(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract remove(): Promise<void>;

  connect?(): Promise<void>;

  updateStatus(status: ServiceStatus, err?: unknown) {
    this.status = status;
    this.callHook("status", status);

    if (err) {
      this.logs.push(err instanceof Error ? err.stack : err, "utf8");
    }
  }

  /**
   * Returns environment variables that can be used to access the service.
   */
  env(): Record<string, string> | undefined {
    return;
  }
}
