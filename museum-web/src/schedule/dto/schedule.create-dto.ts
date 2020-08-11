import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, Matches } from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ScheduleCreateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(CONSTANTS.Regex.schedule))
  schedule: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  capacity: number;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean
}