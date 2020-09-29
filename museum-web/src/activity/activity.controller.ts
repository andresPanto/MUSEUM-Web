import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, NotFoundException, InternalServerErrorException, Session } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService) {
  }
  @Get('/:type')
  async categoryActivities(
    @Res() res,
    @Param() route,
    @Query() query,
    @Session() session
  ){
        let username;
        if(typeof session.username != 'undefined'){
          username = session.username
        }
      const search = query.q;  
      try{
        if (typeof search != 'undefined'){
          let activities = await this._activityService.searchActivities(search,route.type);
          if(activities && activities.length>=1){
            res.render('module_client/category.ejs', {category: route.type, activitiesArray: activities, username:username});
          }else{
            res.render('module_client/category.ejs', {category: route.type, username: username });
          }
        }else{
          let activities = await this._activityService.getCategoryActivities(route.type);
          if(activities && activities.length>=1){
            res.render('module_client/category.ejs', {category: route.type, activitiesArray: activities, username:username});
          }else{
            throw new NotFoundException('There are no activities matching this category.');
          }
        }
        
      }catch(e){
        console.log("Error:",e);
        throw new NotFoundException('This page is not available.');
      }
  }
  @Get('/:type/:idActivity')
  async getActivity(
    @Res() res,
    @Param() route,
    @Session() session
  ){
    try{
      let username;
        if(typeof session.username != 'undefined'){
          username = session.username
        }
      const idActivity = route.idActivity;
      let activity = await this._activityService.getActivity(idActivity);
      if (activity){
        res.render('module_client/activity.ejs',{username:username, activity: activity});
      }else{
        throw new NotFoundException('Activity not found.');
      }
    }catch(e){
        console.log("Error:",e);
        throw new NotFoundException('This page is not available.');
      }
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