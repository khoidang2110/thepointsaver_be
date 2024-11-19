import { ApiProperty } from "@nestjs/swagger"
import {  IsEmail, IsNotEmpty } from "class-validator"

export default class loginDTO  {
    @ApiProperty( {type:String,description:"email"})
    @IsEmail()
    email: string

    @ApiProperty( {type:String,description:"password"})
    @IsNotEmpty()
    password: string
}