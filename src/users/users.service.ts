import { Injectable } from '@nestjs/common';
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


        async getUserInfo(token: string): Promise<any> {
          try {
            // Get the secret key from the config service
            const secretKey = this.configService.get("SECRET_KEY");
        
            // Verify the token and decode it
            const decoded = await this.jwtService.verifyAsync(token, {
              secret: secretKey, // Ensure secret key is provided
            });
        
            // Extract user information from the decoded token
            const { user_id, user_name, phone, email } = decoded;
        
            // Return the user information directly from the token payload
            return {
              statusCode: 200,
              data: {
                user_id,
                user_name,
                phone,
                email,
              },
            };
          } catch (err) {
            // Handle invalid or expired token
            return {
              statusCode: 401,
              message: 'Invalid or expired token',
              error: err.message,
            };
          }
        }


}
