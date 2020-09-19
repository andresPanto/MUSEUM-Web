import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService) {
  }


  @Get()
  mostrarTodos() {

  }

  @Post()
  crearUno(
    @Body() parametrosDeCuerpo,
  ) {

  }

  @Put('/:id')
  editarUno(
    @Param() parametrosDeRuta,
    @Body() parametrosDeCuerpo,
  ) {

  }

  @Delete('/:id')
  eliminarUno(
    @Param() parametrosDeRuta,
  ) {

  }
 
  

}