import {
  IsBoolean,
  IsBooleanString, IsInt,
  IsNotEmpty,
  IsNumber, IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ArtworkCreateDto{
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  type: string;

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

  @IsBoolean()
  @IsNotEmpty()
  status: boolean
}