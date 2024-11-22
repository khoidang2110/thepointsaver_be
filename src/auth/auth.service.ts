import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    prismaService = new PrismaClient();
    constructor(
        private readonly jwtService: JwtService,
        //private prismaService: PrismaService,
        private configService:ConfigService
    ){}

    async login(email: string, password: string): Promise<any> {
      try {
        // B1: Kiểm tra email có tồn tại trong DB hay không
        const checkUser = await this.prismaService.users.findFirst({
          where: {
            email: email,
          },
        });
    
        if (!checkUser) {
          // Trả về lỗi 400 nếu user không tồn tại
          console.log('case no mail')
          throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        }
    
        // Nếu user tồn tại trong DB => kiểm tra password
        const isCorrectPass = bcrypt.compareSync(password, checkUser.password);
    
        if (!isCorrectPass) {
          // Trả về lỗi 401 nếu password không khớp
          throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
        }
    
        // Nếu password khớp => tạo token
        const payload = {
          user_id: checkUser.user_id,
          user_name: checkUser.user_name,
          email: checkUser.email,
          phone: checkUser.phone,
          user_role: checkUser.user_role,
          is_blocked: checkUser.is_blocked,
        };
    
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('SECRET_KEY'),
          expiresIn: this.configService.get('EXPIRES_IN'),
        });
    
        return {
          statusCode: HttpStatus.OK,
          message: 'Login successful',
          data: { token },
        };
      } catch (error) {
        // Bắt tất cả lỗi khác nếu có
        throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
      async signUp(body: CreateUserDto): Promise<any> {
        function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        try {
          const exitingUser = await this.prismaService.users.findFirst({
            where: {
              user_name: body.user_name,
            },
          });
          if (exitingUser) {
            return {
              status: 409,
              message: 'User already exists',
            };
          }
          const exitingEmail = await this.prismaService.users.findFirst({
            where: {
              email: body.email,
            },
          });
          if (exitingEmail) {
            return {
              status: 409,
              message: 'Email already exists',
            };
          }
          const hashedPassword = await bcrypt.hash(body.password, 10);
    
          await this.prismaService.users.create({
            data: {
              ...body,
              password: hashedPassword,
              user_role: 'user',
              user_id: getRandomInt(1, 10000),
            },
          });
          return {
            status: 201,
            data: 'Đăng ký thành công',
          };
        } catch (error) {
          console.error('Error creating user:', error);
          return {
            status: 500,
            message: 'Internal Server Error',
          };
        }
      }
}
