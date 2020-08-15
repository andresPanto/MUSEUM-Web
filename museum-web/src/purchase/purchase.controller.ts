import { PurchaseService } from './purchase.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { PurchaseCreateDto } from './dto/purchase.create-dto';
import moment from 'moment';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchasesService: PurchaseService) {
  }

  @Get()
    mostrarTodos(){

    }
    @Get('/:id')
    mostrarUno(
      @Param() parametrosDeRuta
    ){

    }
  @Post()
  async crearUno(
    @Body() parametrosDeCuerpo,
  ) {
    const newPurchase = new PurchaseCreateDto();
    const attendanceDate = new Date(parametrosDeCuerpo.attendanceDate);
    const purchaseTime = new Date(parametrosDeCuerpo.purchaseTime);
    attendanceDate.setDate(attendanceDate.getDate() + 1);
    purchaseTime.setHours(purchaseTime.getHours() + 5);
    newPurchase.attendanceDate = attendanceDate;
    newPurchase.purchaseTime = purchaseTime;
    newPurchase.quantity = parametrosDeCuerpo.quantity;
    newPurchase.total = parametrosDeCuerpo.total;
    newPurchase.status = parametrosDeCuerpo.status;

    try {
      const errors : ValidationError[] = await validate(newPurchase)
      if(errors.length > 0){
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new Purchase')
      }else {
        const savedPurchase = this.purchasesService.create(newPurchase);
        return savedPurchase
      }
    }catch (e) {
      console.log(e);
      throw new BadRequestException('Errors validating input')
    }
  }
    @Put('/:id')
    editarUno(
      @Param() parametrosDeRuta,
      @Body() parametrosDeCuerpo
    ){

    }
    @Delete('/:id')
    eliminarUno(
      @Param() parametrosDeRuta
    ){

    }

}