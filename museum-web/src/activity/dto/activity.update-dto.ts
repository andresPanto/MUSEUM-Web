import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ActivityUpdateDto {
  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  @Matches(new RegExp(CONSTANTS.Regex.activityType))
  type: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @MinLength(3)
  location: string;

  @IsDate()
  @IsOptional()
  initialDate: Date;

  @IsDate()
  @IsOptional()
  finalDate: Date;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @MinLength(3)
  description: string;

  @IsString()
  @IsOptional()
  @Matches(new RegExp(CONSTANTS.Regex.activityDuration))
  duration: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  pmName: string;

  @IsString()
  @IsOptional()
  @Matches(new RegExp(CONSTANTS.Regex.phone))
  pmPhoneNumber: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;

  @IsBoolean()
  @IsOptional()
  status: boolean
}