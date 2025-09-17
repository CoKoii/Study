import * as express from "express";
import { Logger } from "./logger";
import * as path from "path";
export class NestApplication {
  private readonly app: express.Express = express();
  constructor(protected readonly module: any) {}
  async init() {
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    Logger.log("AppModule dependencies initalized", "InstanceLoader");
    for (const Controller of controllers) {
      const controller = new Controller();
      const prefix = Reflect.getMetadata("prefix", controller) || "/";
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver");
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        const method = controllerPrototype[methodName];
        const httpMethod = Reflect.getMetadata("method", method);
        const pathMetadata = Reflect.getMetadata("path", method);
        if (!httpMethod) continue;
        const routePath = path.posix.join("/", prefix, pathMetadata);
        this.app[httpMethod.toLowerCase()](
          routePath,
          (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
          ) => {
            const result = method.call(controller, req, res, next);
            res.send(result);
          }
        );
        Logger.log(
          `Mapped {${routePath}, ${httpMethod}} route`,
          "RoutesResolver"
        );
      }
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
