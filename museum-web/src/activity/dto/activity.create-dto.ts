import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ActivityCreateDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(CONSTANTS.Regex.activityType))
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(3)
  location: string;

  @IsDate()
  @IsNotEmpty()
  initialDate: Date;

  @IsDate()
  @IsNotEmpty()
  finalDate: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(3)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(CONSTANTS.Regex.activityDuration))
  duration: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  @Matches(new RegExp(CONSTANTS.Regex.lettersSpaces))
  pmName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(CONSTANTS.Regex.phone))
  pmPhoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  imagePath: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean
}