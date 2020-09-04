import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService) {
  }

  @Get('/:category')
  getCategory(
        @Res() res,
        @Param() routeParam
  ){
      res.render('module_client/category.ejs',{logged_in: false,category: routeParam.category})
  }
  
  @Get()
  mostrarTodos() {

  }

  @Get(':category/:id')
  mostrarUno(
    @Param() routeParam, @Res() res
  ) {
    res.render('module_client/activity.ejs',{logged_in: false, category: routeParam.category, activity: routeParam.id })
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