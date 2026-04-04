import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Dynamic configuration from environment
  const port = process.env.PORT || 3001;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',');
  const apiPrefix = 'api';
  
  // Security headers
  try {
    const helmet = require('helmet');
    app.use(helmet());
  } catch (e) {
    console.warn('[Security Warning]: Helmet not found. Consider running "npm install helmet".');
  }
  
  // CORS configuration
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  app.setGlobalPrefix(apiPrefix);

  // Global validation and pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Phdaot API')
    .setDescription('The Phdaot Project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
