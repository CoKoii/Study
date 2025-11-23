import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
