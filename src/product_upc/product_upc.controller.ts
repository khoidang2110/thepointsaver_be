import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductUpcService } from './product_upc.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Product-upc')
@ApiBearerAuth() // Yêu cầu Bearer Token trong Swagger
@ApiHeader({
  name: 'auth_token',
  description: 'Token xác thực của người dùng',
  required: true,
  schema: {
    type: 'string',
  },
})
@Controller('product-upc')
export class ProductUpcController {
  constructor(
    private readonly productUpcService: ProductUpcService
    ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Roles('admin', 'user')  // Bảo vệ bằng JWT, là khi nhập token vào thì check xem còn hạn không
  async getAllProductUpcs() {
    return await this.productUpcService.findAll();
  }


  @Post('create')
  @ApiConsumes('multipart/form-data') // Cung cấp hỗ trợ cho multipart/form-data
  @UseInterceptors(FileInterceptor('file')) // Sử dụng FileInterceptor để xử lý file upload
  @ApiBody({
    description: 'Dữ liệu tạo sản phẩm',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tên sản phẩm' },
        description: { type: 'string', description: 'Mô tả sản phẩm' },
        upc: { type: 'string', description: 'Mã UPC' },
        file: {
          type: 'string',
          format: 'binary', // Định dạng binary cho file
          description: 'Ảnh sản phẩm',
        },
      },
    },
  })
  async createProduct(
    @Body() body: { name: string; description: string; upc: string }, // Dữ liệu JSON
    @UploadedFile('file') file: Express.Multer.File, // File tải lên
  ) {
    
    // Xử lý lưu sản phẩm và file
    const result = await this.productUpcService.createProduct(body, file);
    return {
      message: 'Product created successfully',
      data: result,
    };
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // upladCloud(@UploadedFile() file: Express.Multer.File) {
  //   return this.cloudinarySerivce.uploadImage(file);
  // }

}








