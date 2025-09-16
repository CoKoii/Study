import * as express from "express";
import { Logger } from "./logger";
export class NestApplication {
  private readonly app: express.Express = express();
  constructor(protected readonly module: any) {}
  async init() {}
  async listen(port: number) {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        "Application is running on http//localhost:" + port,
        "NestApplication"
      );
    });
  }
}
