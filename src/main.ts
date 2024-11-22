import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as cors from 'cors';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);


    // CORS
    const allowedOrigins = [
      'https://thepointsaver.vercel.app/',
      'http://localhost:3000',
    
    ];
  
    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
  
    app.use(cors(corsOptions)); // Sử dụng CORS với cấu hình
const config  = new DocumentBuilder()

.setTitle("The point saver API")
.addBearerAuth()
.setVersion("1.0")
.build()

//  // Sử dụng ValidationPipe để tự động validate DTO
//  app.useGlobalPipes(new ValidationPipe());

//  // Sử dụng bộ lọc ngoại lệ mặc định
//  const { httpAdapter } = app.get(HttpAdapterHost);
//  app.useGlobalFilters(new AllExceptionsFilter(httpAdapte));

const swagger = SwaggerModule.createDocument(app,config);


SwaggerModule.setup("swagger",app,swagger)






app.enableCors();
  await app.listen(8083);
}
bootstrap();

