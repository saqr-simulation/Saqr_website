import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readEnvironment } from './config/environment';
async function bootstrap() {
  const config = readEnvironment();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.PLATFORM_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('SAQR Core API')
      .setDescription(
        'SAQR platform API for courses, enrollment, progress and assessments.',
      )
      .setVersion('0.2.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, document);
  await app.listen(config.PORT, '0.0.0.0');
}
bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message.replace(/postgresql:\/\/[^\s@]+@/g, 'postgresql://***@')
      : 'Unknown startup error.';
  console.error(`Core API startup failed: ${message}`);
  process.exitCode = 1;
});
