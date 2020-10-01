import {
  IsBoolean,
  IsBooleanString,
  IsEmpty,
  IsNotEmpty, IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class AuthorUpdateDto{
  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  fullName: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @MinLength(3)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;

  @IsBooleanString()
  @IsOptional()
  status: boolean
}