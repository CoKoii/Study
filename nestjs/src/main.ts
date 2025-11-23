import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(Logger));
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(Logger), httpAdapterHost),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
