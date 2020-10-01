import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { PurchaseCreateDto } from '../purchase/dto/purchase.create-dto';
import { validate, ValidationError } from 'class-validator';
import { ScheduleCreateDto } from './dto/schedule.create-dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly schedulesService: ScheduleService) {
  }
  @Get('/:idActivity')
  schedules(){
    //Render activity-schedule.ejs
  }
  @Get('/:idActivity/new')
  create(){
    //Render schedule.ejs
  }
  @Get('/:idActivity/:idSchedule')
  edit(){
    //Render schedule.ejs
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
    const newSchedule = new ScheduleCreateDto();
    newSchedule.schedule = parametrosDeCuerpo.schedule;
    newSchedule.capacity = parametrosDeCuerpo.capacity;
    newSchedule.status = parametrosDeCuerpo.status;
    try {
      const errors : ValidationError[] = await validate(newSchedule);
      if(errors.length > 0){
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new Purchase')
      }else {
        return 'no errors'
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