import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // standard cors and api prefix for REST
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001/api`);
}
bootstrap();
