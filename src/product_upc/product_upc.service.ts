import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';



@Injectable()
export class ProductUpcService {
  private prisma = new PrismaClient(); // Tạo PrismaClient để kết nối với database

  constructor(
    private cloudinaryService:CloudinaryService

){}
 

  async findAll() {
    // Lấy tất cả các bản ghi từ bảng product_upc
    return await this.prisma.product_upc.findMany();
  }

  async createProduct(
    body: { name: string; description: string; upc: string },
    file: Express.Multer.File,
  ) {
    // Kiểm tra xem file có tồn tại không
    if (!file) {
      throw new BadRequestException('File image is required.');
    }
  
    try {
      // Tải file ảnh lên Cloudinary và lấy URL ảnh
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
  
      // Kiểm tra xem Cloudinary có trả về URL hợp lệ không
      if (!uploadedImage || !uploadedImage.secure_url) {
        throw new Error('Image upload failed.');
      }
  
      // Lưu sản phẩm vào database
      const product = await this.prisma.product_upc.create({
        data: {
          name: body.name,
          description: body.description || null,
          upc: body.upc,
          img_url: uploadedImage.secure_url, // Lưu URL ảnh thay vì path
        },
      });
  
      return product;
    } catch (error) {
      throw new BadRequestException('Error creating product: ' + error.message);
    }
  }
  

}
