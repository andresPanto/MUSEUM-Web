import { Controller, Get, Res, Param, InternalServerErrorException, Query, Session, Req } from '@nestjs/common';
import { ActivityEntity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { AppService } from './app.service';
import { PurchaseService } from './purchase/purchase.service';
import { ScheduleEntity } from './schedule/schedule.entity';
import { ScheduleService } from './schedule/schedule.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly _activityService: ActivityService,
              private readonly _scheduleService: ScheduleService,
              private readonly _purchaseService: PurchaseService,
              private readonly _authService: AuthService
              ) {}
              


  @Get('/')
  async gethome(
        @Res() res,
        @Query() query,
        @Session() session
    ) {
        const logged_in = (typeof session.username != 'undefined');
        let username;
        if(logged_in){
          username = session.username
        }
        try{
          //Get the three most purchased performances        
        let rp =  await this.getTopPurchasedActivities('Performance',3);
        let performances = await this._activityService.getActivities(rp);
        //Get the three most purchased exhibitions 
        let re =  await this.getTopPurchasedActivities('Exhibition',3);
        let exhibitions = await this._activityService.getActivities(re);
        //Get the three most purchased film activities 
        let rf =  await this.getTopPurchasedActivities('Film',3);
        let films = await this._activityService.getActivities(rf);
        //Get tours
        let tours =  await this._activityService.getCategoryActivities('Tour');
        res.render('module_client/index.ejs',{logged_in: logged_in, 
                                              performancesArray: performances,
                                              exhibitionsArray:exhibitions,
                                              filmsArray: films,
                                              toursArray: tours,
                                              message: query.message,
                                             username: username,
                                            error:query.error});
        } catch(e){
          throw new InternalServerErrorException('Error getting main activities.');
        }
        

  }

  @Get('/admin')
  showDashboard(
    @Session() session,
    @Res() res,
    @Query() queryParams
  ){
    const message = queryParams.message;
    const isLogedIn = this._authService.isLogedInAs(session, 'admin');
    if(!isLogedIn){
     return  res.redirect('/users/admin')
    }
    return res.render('module_admin/dashboard',
      {
        username: session.username,
        message
      })
  }

  @Get('/admin/logout')
  logOutAdmin(
    @Session() session,
    @Res() res,
    @Req() req
  ){
    this._authService.logOut(session, req);
    return res.redirect('/users/admin')

  }
  
  
  //TODO: Refactorize this function
  async getTopPurchasedActivities(type: String, quantity: number) {
    let activities: Array<ActivityEntity> = [];
        try{
          //Obtain id's of activities
          activities = await this._activityService.getCategoryActivities(type);
            var idActivities = {};
              if(activities){
                  activities.forEach(element => {
                    idActivities[element.idActivity] = []
                });
                let quantities = {};
                let schedules: Array<ScheduleEntity> = [];
                //Obtain id's of schedules of each performance
                for (let key in idActivities) {
                  quantities[key] = 0
                  schedules = await this._scheduleService.getScheduleActivity(Number(key));
                  if(schedules){
                    let purchase;
                      schedules.forEach(async element => {
                        idActivities[key].push(element.idSchedule);
                        let quantity;
                        try{
                          //Obtain sum of purchases of each schedule
                          purchase = await this._purchaseService.getSchedulePurchases(element.idSchedule);
                          if(typeof purchase != 'undefined'){
                          quantity = Number(purchase['SUM(`purchase`.`quantity`)']);
                          //Append each sum of purchase to the greater sum of purchases of an activity
                          quantities[key] = quantities[key] + quantity;
                          }
                        }catch(e){
                            console.log("Error:", e);
                        }
                    }); 
                  }
                }
                var items = Object.keys(quantities).map(function(key) {
                  return [key, quantities[key]];
                });
                items.sort(function(first, second) {
                  return second[1] - first[1];
                });
                let merged = [].concat.apply([], items.slice(0, quantity));
                var res: String[] = [];
                for(let i = 0; i<(quantity*2); i+=2){
                    res.push(merged[i]);
                }
                //Return id's of n(quantity) most purchased activities
                return res;
              }  
        }catch (error){
          console.log(error);
          throw new InternalServerErrorException('Error finding activities.');
        }
  }
  
}
