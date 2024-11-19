import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import loginDTO from './dto/login.dto';


@ApiTags('Auth') // Adding a Swagger tag for the Auth endpoints
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
   
  ) {}

  @Post('/login')
  // Use @Body to capture the email and password in the request body
  @ApiBody({ description: 'Thong tin dang nhap', type: loginDTO })
  async login(@Body() body: { email: string; password: string }, @Res() response) {
    try {
      const data = await this.authService.login(body.email, body.password);
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json({ status: 500, message: error.message });
    }
  }

  @Post('/sign-up')
  @ApiBody({ description: 'Thong tin dang ky', type: CreateUserDto })
  async signUp(@Body() body: CreateUserDto, @Res() response): Promise<any> {
    try {
      let data = await this.authService.signUp(body);
      response.status(data.status).json(data);
    } catch (error) {
      response.status(500).json({ status: 500, message: error.message });
    }
  }
}


  // login, signup ,logout ( xoá token hoac session)

  //signup phải check trùng email, trùng tên user


