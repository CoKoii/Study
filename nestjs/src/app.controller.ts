import { Controller, Get } from "@nestjs/common";
@Controller("/api")
export class AppController {
  @Get("info")
  getHello(): string {
    return "Hello World!";
  }
}
