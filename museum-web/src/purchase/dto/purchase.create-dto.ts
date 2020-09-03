import { IsBoolean, IsDate, IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PurchaseCreateDto{
  @IsDate()
  @IsNotEmpty()
  attendanceDate: Date;

  @IsDate()
  @IsNotEmpty()
  purchaseTime: Date;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  total: number;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}