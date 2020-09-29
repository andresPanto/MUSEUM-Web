import { PurchaseService } from './purchase.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res, Session } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { PurchaseCreateDto } from './dto/purchase.create-dto';
import { ActivityService } from 'src/activity/activity.service';
import { ScheduleService } from 'src/schedule/schedule.service';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchasesService: PurchaseService,
    private readonly _activityService: ActivityService,
    private readonly _scheduleService: ScheduleService) {
  }
  @Get()
  myPurchases(){ //Valido si es cliente o admin, renderizo client/myactivities ó admin/purchases.ejs
    //Get current user from cookies
    //Render myactivities.ejs
  }
  @Get('/:idActivity')
  async getPurchase(
    @Res() res,
    @Session() session,
    @Param() route
  ){
    const estaLogeado = session.username;
    if(estaLogeado){
      const idActivity = route.idActivity;
      if(!isNaN(idActivity)){
        try{
          let activity = await this._activityService.getActivity(idActivity);
          let schedules = await this._scheduleService.getScheduleActivity(activity.idActivity);
          res.render('module_client/purchase',{username:session.username, activity: activity, schedules:schedules});
        }catch(e){
          console.log("Error activity purchase: ",e);
          res.redirect('/?error=Error while getting activity, try again later.')
        }
        
      }else{
        res.redirect('/?error=Activity Not Found')
      }
      
    }else{
      res.redirect('/?message=Please log in.');     
    }
      
    
  }
  @Post('/:idActivity')
  purchase(
    @Res() res,
    @Body() body,
    @Param() route
  ){
    const idActivity = Number(route.idActivity);
    const idSchedule = Number(body.schedule);
    const quantity = Number(body.quantity);
    const attendance_date = body.date;
    //Hacer un update en la tabla schedule para disminuir el campo 'capacity' según lo que se compró (quantity)
    //For purchasing
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