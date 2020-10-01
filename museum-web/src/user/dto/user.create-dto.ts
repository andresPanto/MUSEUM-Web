import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class UserCreateDto{
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(CONSTANTS.Regex.phone))
  phoneNumber: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean
}