import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class UserUpdateDto{


  @IsString()
  @IsOptional
  @MaxLength(20)
  @MinLength(3)
  password: string;

  @IsEmail()
  @IsOptional
  email: string;


  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;


}