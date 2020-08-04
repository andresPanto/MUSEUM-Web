import { IsBoolean, IsBooleanString, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class AuthorCreateDto{
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  country: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(3)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;

  @IsBooleanString()
  @IsNotEmpty()
  status: boolean
}