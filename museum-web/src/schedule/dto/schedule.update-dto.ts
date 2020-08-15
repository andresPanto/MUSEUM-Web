import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { CONSTANTS } from '../../enviroment/constants';

export class ScheduleUpdateDto{
  @IsString()
  @IsOptional()
  @Matches(new RegExp(CONSTANTS.Regex.schedule))
  schedule: string;

  @IsBoolean()
  @IsOptional()
  status: boolean
}