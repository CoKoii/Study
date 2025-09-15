import { Logger } from "./logger";
import * as express from "express";
export class NestApplication {
  private readonly app: express.Express = express();
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
