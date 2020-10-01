import { PurchaseService } from './purchase.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { PurchaseCreateDto } from './dto/purchase.create-dto';
import { ActivityService } from 'src/activity/activity.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { PurchaseEntity } from './purchase.entity';
import { UserService } from 'src/user/user.service';
import moment from 'moment';
import { resolve } from 'path';
import { AuthService } from '../auth/auth.service';



@Controller('purchases')
export class PurchaseController {
  constructor(private readonly _purchaseService: PurchaseService,
    private readonly _activityService: ActivityService,
    private readonly _scheduleService: ScheduleService,
    private readonly _userService: UserService,
    private readonly _authService: AuthService) {
  }

  @Get()
  async myPurchases(
    @Res() res,
    @Session() session
  ){
    const estaLogeado = session.username;
    if(estaLogeado){
      try{
        let user = await this._userService.findOneByID(session.userId);
        let userPurchases = await this._purchaseService.getUserPurchasesWithSchedule(user);
        if(userPurchases){
          let activities = [];
          let scheduleActivity;
          for (var purchase of userPurchases){
            scheduleActivity = await this._scheduleService.getScheduleWithActivity(purchase.schedule);
            activities.push({'act_name':scheduleActivity.activity.name,
            'act_type':scheduleActivity.activity.type,'qty':purchase.quantity,
            'att_date':purchase.attendanceDate,'total':purchase.total,
          'id_act':scheduleActivity.activity.idActivity});
          }
          res.render('module_client/myactivities', {username: session.username, activities: activities});
        }else{
          res.render('module_client/myactivities', {username: session.username, activities: undefined});
        }
        
      } catch (e) {
        console.log("Error getting user's activities: ", e);
        return res.redirect('/?error=There was an error, try again later.');
      }
    } else {
      return res.redirect('/?message=Please log in.');
    }

  }

  @Get('/:idActivity')
  async getPurchase(
    @Res() res,
    @Session() session,
    @Param() route,
    @Query() query
  ){
    if (route.idActivity == 'admin'){
      this.purchaseAdmin(res, session, query)
    }else{
    const estaLogeado = session.username;
    if(estaLogeado){
      const idActivity = route.idActivity;
      if(!isNaN(idActivity)){
        try{
          let activity = await this._activityService.getActivity(idActivity);
          let schedules = await this._scheduleService.getScheduleActivity(activity.idActivity);
          return res.render('module_client/purchase',{username:session.username, activity: activity, schedules:schedules, error: query.error, success: query.success});
        }catch(e){
          console.log("Error activity purchase: ",e);
          return res.redirect('/?error=Error while getting activity, try again later.')
        }
        
      }else{
        return res.redirect('/?error=Activity Not Found')
      }
      
    }else{
      return res.redirect('/?message=Please log in.');     
    }
    }
      
    
  }

  @Post('/:idActivity')
  async purchase(
    @Res() res,
    @Body() body,
    @Param() route,
    @Session() session
  ){
    try{
    const idActivity = Number(route.idActivity);
    const idSchedule = Number(body.schedule);
    const quantity = Number(body.quantity);
    const attendance_date =  new Date(body.date)//.replace(/\//g, '-');
    const newPurchase = new PurchaseCreateDto();
    newPurchase.attendanceDate = body.date;
    newPurchase.quantity = quantity;
    newPurchase.status = true;
    const errors : ValidationError[] = await validate(newPurchase)
        if(errors.length > 0){
          console.log('Errors', errors);
          res.redirect('/purchases/'+route.idActivity+'?error=Select a valid date!');
        }else { 
          let activity = await this._activityService.getActivity(idActivity);
          let schedule = await this._scheduleService.getSchedule(idSchedule);
          let user = await this._userService.findOneByID(session.userId);
          try{
            attendance_date.setDate(attendance_date.getDate() + 1);
            let pDate = new Date().toLocaleDateString();
            let pTime = new Date().toLocaleTimeString();
            let purchaseTime = pDate.replace(/\//g, '-') + ' ' + pTime.split(' ')[0]
            let purchase: PurchaseEntity = new PurchaseEntity();
            purchase.purchaseTime = purchaseTime;
            purchase.attendanceDate = attendance_date;
            purchase.quantity = quantity;
            purchase.total = activity.price * quantity;
            purchase.schedule = schedule;
            purchase.user = user;
            purchase.status = true;
            let response = await this._purchaseService.savePurchase(purchase);
            if(response){
              schedule.capacity = schedule.capacity - quantity;
              let resp = await this._scheduleService.updateSchedule(schedule);
              if(resp){
                return res.redirect('/purchases/'+route.idActivity+'?success=Purchase registered successfully!');
              }
            }
          }catch(e){
            console.error('Error while purchasing: ', e);
            return res.redirect('/purchases/'+route.idActivity+'?error=There was an error, try again later.');
          }
        
        }

    }catch (e){
      console.error('Error while purchasing: ', e);
      return res.redirect('/purchases/'+route.idActivity+'?error=There was an error, try again later.');
    }
  }

  @Get('/admin/status/:idPurchase')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams
  ){
    console.log('purchase status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change purchase status';
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedPurchase;

    try {
      const idPurchase = Number(routePrams.idPurchase);

      const purchase: PurchaseEntity = await this._purchaseService.findOneByID(idPurchase);
      purchase.status = !purchase.status;
      updatedPurchase = await this._purchaseService.update(purchase)
    }catch (e) {
      console.log(e);
      return res.redirect(`/purchases/admin?message=${message}`)
    }
      if (updatedPurchase){
        return res.redirect(`/purchases/admin`)
      }else{
        return res.redirect(`/purchases/admin?message=${message}`)
      }
  }



  async purchaseAdmin(
    @Res() res,
    @Session() session,
    @Query() queryParams,
  ) {
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin')
    if(isNotAdmin){
      res.redirect('/users/admin')
    }

    let purchases;
    console.log('Get purchases admin');
    try {
      purchases = await this._purchaseService.findAll();
    } catch (e) {
      console.log(e);
      const message = 'Failure loading Purchases';
      return res.redirect(`/admin?message=${message}`);
    }
    return res.render(
      'module_admin/purchases',
      {
        purchases,
        username: session.username,
        message: queryParams.message
      });
  }

}