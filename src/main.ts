import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Settig up swagger docs
  const config = new DocumentBuilder()
    .setTitle('Activity Manager Service')
    .setDescription('The activity manager service api description')
    .setVersion('1.0')
    .addTag('activities')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Starting service
  await app.listen(3000);
  console.log('Application is running on PORT: 3000');
}

bootstrap();
