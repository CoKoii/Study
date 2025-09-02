import express, { Express } from "express";
import { Logger } from "./logger";
export class NestApplication {
  private readonly app: Express = express();
  constructor(protected readonly module) {}
  async init() {}
  async listen(port) {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on: http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
