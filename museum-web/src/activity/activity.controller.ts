import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService) {
  }
  @Get('/:type')
  async categoryActivities(
    @Res() res,
    @Param() route,
    @Query() query
  ){
      const search = query.q;  
      try{
        if (typeof search != 'undefined'){
          let activities = await this._activityService.searchActivities(search,route.type);
          if(activities && activities.length>=1){
            res.render('module_client/category.ejs', {category: route.type, activitiesArray: activities, logged_in:false});
          }else{
            res.render('module_client/category.ejs', {category: route.type, logged_in:false});
          }
        }else{
          let activities = await this._activityService.getCategoryActivities(route.type);
          if(activities && activities.length>=1){
            res.render('module_client/category.ejs', {category: route.type, activitiesArray: activities, logged_in:false});
          }else{
            throw new NotFoundException('There are no activities matching this category.');
          }
        }
        
      }catch(e){
        console.log("Error:",e);
        throw new NotFoundException('This page is not available.');
      }
    
    //Render template category.ejs
  }
  @Get('/:type/:idActivity')
  async getActivity(
    @Res() res,
    @Param() route
  ){
    try{
      const idActivity = route.idActivity;
      let activity = await this._activityService.getActivity(idActivity);
      if (activity){
        res.render('module_client/activity.ejs',{logged_in:false, activity: activity});
      }else{
        throw new NotFoundException('Activity not found.');
      }
    }catch(e){
        console.log("Error:",e);
        throw new NotFoundException('This page is not available.');
      }
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