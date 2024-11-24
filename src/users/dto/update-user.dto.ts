// import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from '../../auth/dto/create-user.dto';

import { ApiProperty } from '@nestjs/swagger';

//export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  user_name?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  city?: string;
  @ApiProperty()
  state?: string;
  @ApiProperty()
  zip?: number;
  @ApiProperty()
  country?: string;
}
