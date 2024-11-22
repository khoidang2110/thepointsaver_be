import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  
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

