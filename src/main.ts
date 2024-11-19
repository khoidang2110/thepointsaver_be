import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as multer from 'multer';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

const config  = new DocumentBuilder()

.setTitle("The point saver API")
.addBearerAuth()
.setVersion("1.0")
.build()


const swagger = SwaggerModule.createDocument(app,config);

// setup swagger với đường dẫn là /swagger
//local
//SwaggerModule.setup("swagger",app,swagger)

//vps
app.setGlobalPrefix('tps'); 
SwaggerModule.setup('swagger', app, swagger);





app.enableCors();
  await app.listen(8083);
}
bootstrap();

