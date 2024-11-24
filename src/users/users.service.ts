import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {

  prismaService = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    //private prismaService: PrismaService,
    private configService:ConfigService
){}


  async updateUser(body: UpdateUserDto, req: any): Promise<any> {
    try {
      const reqUser = req.user;
  //console.log(body,req.user)
      // Tìm user dựa trên email
      const existingUser = await this.prismaService.users.findUnique({
        where: {
          email: body.email,
        },
      });
  
      if (!existingUser) {
        return {
          status: 404,
          message: 'User not found',
        };
      }
  
      // Kiểm tra quyền hạn của người dùng
      if (reqUser.email !== body.email && reqUser.user_role === 'user') {
        return {
          status: 403, // Forbidden status code
          message: 'You are not the owner',
        };
      }
  
      // Tạo đối tượng data để cập nhật
      const updateData: any = {};
      if (body.user_name) updateData.user_name = body.user_name;
      if (body.phone) updateData.phone = body.phone;
      if (body.password) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        updateData.password = hashedPassword;
      }
      if (body.address) updateData.address = body.address;
      if (body.city) updateData.city = body.city;
      if (body.state) updateData.state = body.state;
      if (body.zip) updateData.zip = body.zip;
      if (body.country) updateData.country = body.country;
  
      // Cập nhật user
      const updatedUser = await this.prismaService.users.update({
        where: {
          email: body.email,
        },
        data: updateData,
      });
  
      // Tạo payload và token mới sau khi cập nhật
      const payload = {
        email: updatedUser.email,
        user_name: updatedUser.user_name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        zip: updatedUser.zip,
        country: updatedUser.country,
      };
  
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_KEY'),
        expiresIn: this.configService.get('EXPIRES_IN'),
      });
  
      return {
        status: 200,
        message: 'Update successful',
        token: token,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
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

  async deleteUser(user_id: number): Promise<any> {
    try {
      // Tìm kiếm người dùng theo user_id
      const item = await this.prismaService.users.findFirst({
        where: {
          user_id: user_id, // Không cần dùng dấu `+`, vì `user_id` đã là number
        },
      });
  //console.log(item)
      // Nếu không tìm thấy, ném lỗi NotFoundException
      if (!item) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
  
      // Xóa người dùng
      await this.prismaService.users.delete({
        where: {
          email: item.email,
        },
      });
  
      // Trả về kết quả thành công
      return {
        status: 200,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      // Xử lý lỗi khác
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
async getListUserPagination(
    skip: number,
    numSize: number,
    key: string,
  ): Promise<any> {
    // sequelize -> offset, limit
    // prisma -> take skip
    let user_name = key;
    if (user_name === '{key}' || user_name === ',') {
      //userName=" "
      let data = await this.prismaService.users.findMany({});
      return data;
    } else {
      let data = await this.prismaService.users.findMany({
        where: {
          user_name: {
            contains: user_name,
          },
        },
        skip: skip,
        take: numSize,
      });
      if (data.length === 0) {
        return 'keyword do not match!!!';
      }
      return data;
    }
  }
}
