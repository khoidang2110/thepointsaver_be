import { Injectable } from '@nestjs/common';
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
    async login(email, password): Promise<any> {
        //B1: kiểm tra email có tồn tại trong DB hay không
        let checkUser = await this.prismaService.users.findFirst({
          where: {
            email: email,
          },
        });
        if (checkUser) {
          // nếu user tồn tại trong DB => check password ( bcrypt)
          // npm i bcrypt @types/bcrypt
          //ss 2 pass
          let isCorrectPass = bcrypt.compareSync(password, checkUser.password);
          if (isCorrectPass) {
            let payload = {
              user_id: checkUser.user_id,
              user_name: checkUser.user_name,
              email: checkUser.email,
              phone: checkUser.phone,
              password: checkUser.password,
              user_role: checkUser.user_role,
            };
            // nếu password matching => tạo token
            let token = this.jwtService.sign(payload, {
              secret: this.configService.get('SECRET_KEY'),
              expiresIn: this.configService.get('EXPIRES_IN'),
              //expiresIn: Number(this.configService.get('EXPIRES_IN')),
            });
            return token;
            //nếu không => raise lỗi
          }
          return 'password incorrect ';
        }
    
        return 'User is not exist';
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
              user_id: getRandomInt(1, 100),
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
