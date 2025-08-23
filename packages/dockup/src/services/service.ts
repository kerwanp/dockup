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

export abstract class Service extends Hookable<ServiceEvents> {
  /**
   * Kind of service.
   *
   * @example "container"
   */
  abstract kind: string;

  /**
   * Status of the service.
   */
  status: ServiceStatus = "stopped";

  /**
   * Name of the service type.
   *
   * @example "postgresql"
   */
  name: string;

  /**
   * Name of the service instance.
   *
   * @example "db-1"
   */
  instance: string;

  /**
   * PassThrough stream containing logs.
   */
  logs = new PassThrough();

  constructor(name: string, instance: string) {
    super();
    this.name = name;
    this.instance = instance;
  }

  abstract init(): Promise<void>;
  abstract start(): Promise<void>;
  abstract restart(): Promise<void>;
  abstract stop(): Promise<void>;

  updateStatus(status: ServiceStatus, err?: unknown) {
    this.status = status;
    this.callHook("status", status);

    if (err) {
      this.logs.push(err instanceof Error ? err.stack : err, "utf8");
    }
  }
}
