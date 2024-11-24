import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Res, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { request } from 'https';


@ApiTags("User") // gom nhóm
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
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // getListUser() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
  @Put('/update-user')
  @UseGuards(AuthGuard('jwt'),RoleGuard)
   @Roles('admin', 'user') 
  @ApiBody({ description: 'Thong tin cap nhat', type: UpdateUserDto })
  updateUser(@Body() body: UpdateUserDto,@Req() req): Promise<any> {
    const userDtos = this.usersService.updateUser(body,req);
    return userDtos;
  }



  @Post('/get-user-info')
   @UseGuards(AuthGuard('jwt'),RoleGuard)
   @Roles('admin', 'user')  
   async getUserInfo(@Req() req) {
    const user = req.user; // Thông tin từ JwtStrategy
    return this.usersService.getUserInfo(user.user_id);
  } 

 
  @Delete('/remove-user/:id')
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Roles('admin')  
  @ApiParam({name:"user_id",required:false,description:"remove user id by ADMIN"})
  deleteUser(@Param("user_id") user_id): Promise <any>{
return this.usersService.deleteUser(user_id);
  }
  
  @ApiParam({name:"page",required:false,description:"page number"})
  @ApiParam({name:"size",required:false,description:"item per page"})
  @ApiParam({name:"key",required:false,description:"Search"})
  @Get('get-user-list/:page/:size/:key')
  getListUserPagination(
    @Param('key') key,
    @Param('page') page,
    @Param('size') size,
  ): Promise<any> {
    let numPage = Number(page);
    let numSize = Number(size);
    let skip = (numPage - 1) * numSize;
    return this.usersService.getListUserPagination(skip, numSize, key);
  }


}
