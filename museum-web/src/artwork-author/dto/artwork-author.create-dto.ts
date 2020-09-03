import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ArtworkAuthorCreateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  artwork: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  author: number;
}