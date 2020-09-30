import {
  IsBoolean,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ArtworkUpdateDto{
  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  type: string;

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

  @IsBoolean()
  @IsOptional()
  status: boolean
}