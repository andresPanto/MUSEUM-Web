import { Controller, Get, Res, Param, InternalServerErrorException } from '@nestjs/common';
import { ActivityEntity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { AppService } from './app.service';
import { ScheduleEntity } from './schedule/schedule.entity';
import { ScheduleService } from './schedule/schedule.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly _activityService: ActivityService,
              private readonly _scheduleService: ScheduleService) {}

  //Validar si es admin, si es cliente y si está o no logeado
  //Según esto se renderiza el index deslogeado, index logeado o el dashboard del admin
  @Get('/')
  async gethome(
        @Res() res
    ) {
        //Get N Top performances
        //res.render('module_client/index.ejs',{logged_in: true})
        let performances: Array<ActivityEntity> = [];
        try{
          //Obtain id's of performances
            performances = await this._activityService.getCategoryActivities('Performance');
            var idPerformances = {};
              if(performances){
                  performances.forEach(element => {
                    idPerformances[element.idActivity] = []
                });
                console.log(idPerformances);
                let quantities = {};
                let schedules: Array<ScheduleEntity> = [];
                //Obtain id's of schedules of each performance
                for (let key in idPerformances) {
                  quantities[key] = 0
                  schedules = await this._scheduleService.getScheduleActivity(Number(key));
                  if(schedules){
                      schedules.forEach(element => {
                        idPerformances[key].push(element.idSchedule);
                        //Sacar qty con element.idSchedule directamente y sumar a quantities[key]
                    });
                    
                  }
                  
                  //let value = idPerformances[key];
                  // Use `key` and `value`
                }
                console.log(idPerformances);
                console.log(quantities)
              }  
        }catch (error){
          console.log(error);
          throw new InternalServerErrorException('Error encontrando performances.') 
        }
  }
  
  
}
