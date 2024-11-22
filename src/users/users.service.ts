import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {

  prismaService = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    //private prismaService: PrismaService,
    private configService:ConfigService
){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  async getUserInfo(userId: number): Promise<any> {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await this.prismaService.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        user_name: true,
        email: true,
        phone: true,
        //roles: true, // Chỉ định các trường bạn muốn lấy
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Trả về thông tin người dùng
    return {
      statusCode: 200,
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        phone: user.phone,
        //roles: user.roles,
      },
    };
  }


}
