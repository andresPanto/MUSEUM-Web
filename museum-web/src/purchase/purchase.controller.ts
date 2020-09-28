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
import moment from 'moment';
import { resolve } from 'path';
import { AuthService } from '../auth/auth.service';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { PurchaseEntity } from './purchase.entity';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchasesService: PurchaseService,
              private readonly _authService: AuthService) {
  }

  @Get()
  myPurchases() { //Valido si es cliente o admin, renderizo client/myactivities ó admin/purchases.ejs
    //Get current user from cookies
    //Render myactivities.ejs
  }

  @Get('/:idActivity')
  getPurchase(
    @Res() res,
    @Session() session,
    @Query() queryParams,
    @Param() routeParams
  ) {
    if (routeParams.idActivity == 'admin'){
      this.purchaseAdmin(res, session, queryParams)
    }
    //Render purchase.ejs
  }

  @Post('/:idActivity')
  purchase() {
    //For purchasing
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

      const purchase: PurchaseEntity = await this.purchasesService.findOneByID(idPurchase);
      purchase.status = !purchase.status;
      updatedPurchase = await this.purchasesService.update(purchase)
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
      purchases = await this.purchasesService.findAll();
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


  @Get('/:id')
  mostrarUno(
    @Param() parametrosDeRuta,
  ) {

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
      const errors: ValidationError[] = await validate(newPurchase);
      if (errors.length > 0) {
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new Purchase');
      } else {
        const savedPurchase = this.purchasesService.create(newPurchase);
        return savedPurchase;
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Errors validating input');
    }
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