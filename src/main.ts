import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()

    .setTitle('The point saver API')
    
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const swagger = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, swagger);

  app.enableCors({
    origin: [
      'https://thepointsaver.vercel.app', // Cấu hình cho frontend của bạn
      'http://localhost:3000', // Cấu hình cho localhost (nếu bạn phát triển local)
      'https://api.easybadwork.com', // Thêm domain API của bạn
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization', // Đảm bảo cho phép Authorization header
    credentials: true, // Cho phép gửi cookies (nếu có)
  });

  await app.listen(8083);
}
bootstrap();
