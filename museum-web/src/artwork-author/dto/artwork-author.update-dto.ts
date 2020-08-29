import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ArtworkAuthorUpdateDto {
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