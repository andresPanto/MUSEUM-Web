import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService) {
  }
  @Get('/:type')
  categoryActivities(){
    //Render template category.ejs
  }
  @Get('/:type/:idActivity')
  getActivity(){
    //Render activity.ejs
  }
  @Get('Queryparam')
  searchActivity(){
    //Render activity.ejs with queryparam
  }
  @Get()
  mostrarTodos() {
      //Render activities.ejs
  }
  @Get('new')
  crear(){
    //Render activity.ejs
  }
  @Get('/:idActivity')
  editar(){
    //Render activity.ejs with loaded data
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