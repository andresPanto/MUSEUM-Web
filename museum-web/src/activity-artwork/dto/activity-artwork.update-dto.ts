import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ActivityArtworkUpdateDto {
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