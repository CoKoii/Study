import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAppLogging } from './common/logs/logs.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  setupAppLogging(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
