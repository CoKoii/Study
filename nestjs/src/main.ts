import { NestFactory } from "./@nestjs/core/nest-factory";
import { AppModule } from "./app.module";
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
};
bootstrap();
