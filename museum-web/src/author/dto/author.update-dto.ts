import {
  IsBoolean,
  IsBooleanString,
  IsEmpty,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class AuthorUpdateDto{
  @IsString()
  @IsEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  fullName: string;

  @IsString()
  @IsEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  country: string;

  @IsString()
  @IsEmpty()
  @MaxLength(1000)
  @MinLength(3)
  description: string;

  @IsString()
  @IsEmpty()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;

  @IsBooleanString()
  @IsEmpty()
  status: boolean
}