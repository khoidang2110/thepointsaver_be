import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Res, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { request } from 'https';


@ApiTags("USER") // gom nhóm
@ApiBearerAuth() // Yêu cầu Bearer Token trong Swagger
@ApiHeader({
  name: 'auth_token',
  description: 'Token xác thực của người dùng',
  required: true,
  schema: {
    type: 'string',
  },
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
//getall,update, delete, get
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  getListUser() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }




  @Post('/get-user-info')
   @UseGuards(AuthGuard('jwt'),RoleGuard)
   @Roles('admin', 'user')  
   async getUserInfo(@Req() req) {
    const user = req.user; // Thông tin từ JwtStrategy
    return this.usersService.getUserInfo(user.user_id);
  } 

  
}
