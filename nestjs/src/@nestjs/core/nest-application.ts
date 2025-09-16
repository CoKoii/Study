import * as express from "express";
import { Logger } from "./logger";
import { Controller } from "../common";
export class NestApplication {
  private readonly app: express.Express = express();
  constructor(protected readonly module: any) {}
  async init() {
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    Logger.log("AppModule dependencies initalized", "InstanceLoader");
    for (const controller of controllers) {
      const controller = new Controller();
      const prefix = Reflect.getMetadata("prefix", controller) || "/";
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver");
    }
  }
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
