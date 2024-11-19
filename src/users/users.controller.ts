import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@ApiTags("USER") // gom nhóm
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
  @ApiQuery({ name: 'token', type: 'string', required: false, description: 'Token of the user' })
  async getUserInfo(@Query('token') token: string) {
    return this.usersService.getUserInfo(token);
  } 
}
