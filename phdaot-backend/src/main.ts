import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // standard cors and api prefix for REST
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Phdaot API')
    .setDescription('The Phdaot Project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001/api`);
  console.log(`Swagger documentation: http://localhost:3001/api/docs`);
}
bootstrap();
