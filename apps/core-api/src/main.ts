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
        'Week 1 platform API. Learning and AI endpoints will follow.',
      )
      .setVersion('0.1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, document);
  await app.listen(config.PORT, '0.0.0.0');
}
bootstrap().catch((error: unknown) => {
  console.error(
    error instanceof Error &&
      error.message.startsWith('Invalid Core API configuration:')
      ? error.message
      : 'Core API startup failed. Check environment configuration and PostgreSQL availability.',
  );
  process.exitCode = 1;
});
