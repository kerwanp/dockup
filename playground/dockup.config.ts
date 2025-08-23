import { defineConfig } from "dockup/config";
import {
  postgresql,
  rabbitmq,
  redis,
  mailhog,
  minio,
  localstack,
} from "dockup/services";

export default defineConfig({
  services: [
    postgresql(),
    rabbitmq({ name: "rmq-1", management: 8081 }),
    redis(),
    mailhog(),
    minio(),
    localstack({ services: "s3" }),
  ],
});
