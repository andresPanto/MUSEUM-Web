import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ActivityArtworkCreateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  activity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  artwork: number;
}