import { IsBoolean, IsDate, IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PurchaseCreateDto{

  @IsNotEmpty()
  attendanceDate: Date;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}