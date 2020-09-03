import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UserRoleCreateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  user: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  role: number;

}