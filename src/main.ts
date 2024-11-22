import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()

    .setTitle('The point saver API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, swagger);

  app.enableCors({
    origin: ['https://thepointsaver.vercel.app/', 'http://localhost:3000'], // Địa chỉ client frontend của bạn
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization', // Chắc chắn cho phép Authorization header
  });
  
  await app.listen(8083);
}
bootstrap();
