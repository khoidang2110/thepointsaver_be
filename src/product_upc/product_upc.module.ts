import { Module } from '@nestjs/common';
import { ProductUpcService } from './product_upc.service';
import { ProductUpcController } from './product_upc.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [ CloudinaryModule,],
  controllers: [ProductUpcController],
  providers: [ProductUpcService],
})
export class ProductUpcModule {}
