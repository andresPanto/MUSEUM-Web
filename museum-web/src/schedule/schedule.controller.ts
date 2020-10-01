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
import { ScheduleService } from './schedule.service';
import { PurchaseCreateDto } from '../purchase/dto/purchase.create-dto';
import { validate, ValidationError } from 'class-validator';
import { ScheduleCreateDto } from './dto/schedule.create-dto';
import { AuthService } from '../auth/auth.service';
import { ActivityService } from '../activity/activity.service';
import { AuthorEntity } from '../author/author.entity';
import { ScheduleEntity } from './schedule.entity';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly schedulesService: ScheduleService,
              private readonly _authService: AuthService,
              private readonly _activityService: ActivityService) {
  }
  // @Get('/:idActivity')
  // schedules(){
  //   //Render activity-schedule.ejs
  // }
  // @Get('/:idActivity/new')
  // create(){
  //   //Render schedule.ejs
  // }
  // @Get('/:idActivity/:idSchedule')
  // edit(){
  //   //Render schedule.ejs
  // }

  @Get('/admin/activity/:idActivity')
  async showSchedulesByActivity(
    @Res() res,
    @Session() session,
    @Query() queryParams,
    @Param() routeParams

  ){
    const errorMessage = 'Error Loading Schedules';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let schedules;
    let activity;
    try {
      const idActivity = Number(routeParams.idActivity);
      activity = await this._activityService.findOneByID(idActivity)
      schedules = await this.schedulesService.findAllByActivity(idActivity)
    }catch (e) {
      console.log(e);
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }
    if (schedules && activity){
      return res.render(
        'module_admin/activity-schedules',
        {
          username: session.username,
          message: queryParams.message,
          schedules,
          activity,

        }
      )
    }else{
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }
  }


  @Get('/admin/status/:idActivity/:idSchedule')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams
  ){
    console.log('schedule status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change schedule status';
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedSchedule;
    let idActivity;
    try {
      const idSchedule = Number(routePrams.idSchedule);
      idActivity = Number(routePrams.idActivity);
      const schedule: ScheduleEntity = await this.schedulesService.findOneByID(idSchedule);
      schedule.status = !schedule.status;
      updatedSchedule = await this.schedulesService.update(schedule)
    }catch (e) {
      console.log(e);
      return res.redirect(`/schedules/admin/activity?message=${message}`)
    }
    if (idActivity){
      if (updatedSchedule){
        return res.redirect(`/schedules/admin/activity/${idActivity}`)
      }else{
        return res.redirect(`/schedules/admin/activity/${idActivity}?message=${message}`)
      }
    }else{
      return res.redirect('/activities/admin?message=Activity Not Found')
    }

  }


  @Get('/admin/new/:idActivity')
  async newAuthor(
    @Session() session,
    @Res() res,
    @Query() queryParams,
    @Param() routeParams
  ){

    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    const schedule = queryParams.schedule;
    let idActivity;
    try{
      idActivity = Number(routeParams.idActivity)
    }catch (e) {
      console.log(e);
      return res.redirect('/activities/admin?message=Activity Not Found')
    }
    if(idActivity){
      let time = [undefined, undefined];
      if (schedule){
         time = queryParams.schedule.split(':');
      }
      return res.render(
        'module_admin/schedule',
        {
          username: session.username,
          hours: time[0],
          minutes: time[1],
          capacity: queryParams.capacity,
          message: queryParams.message,
          idActivity
        }
      )
    }else{
      return res.redirect('/activities/admin?message=Activity Not Found')
    }

  }

  @Get('/admin/edit/:idActivity/:idSchedule')
  async updateSchedule(
    @Session() session,
    @Res() res,
    @Query() queryParams,
    @Param() routeParams
  ){

    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    const schedule = queryParams.schedule;
    let idActivity;
    let idSchedule;
    let scheduleObject;
    try{
      idActivity = Number(routeParams.idActivity);
      idSchedule = Number(routeParams.idSchedule);
      scheduleObject = await this.schedulesService.findOneByID(idSchedule)
    }catch (e) {
      console.log(e);
      return res.redirect(`/schedules/admin/activity/${idActivity}?message=Error`)
    }
    if(idActivity){
      let time = [undefined, undefined];
      if (schedule){
        time = queryParams.schedule.split(':');
      }
      if(scheduleObject){
        return res.render(
          'module_admin/schedule',
          {
            username: session.username,
            hours: time[0],
            minutes: time[1],
            capacity: queryParams.capacity,
            message: queryParams.message,
            idActivity,
            schedule: scheduleObject
          }
        )
      }else{
        return res.redirect(`/schedules/admin/activity/${idActivity}?message=Failed to find schedule`)
      }

    }else{
      return res.redirect('/activities/admin?message=Activity Not Found')
    }

  }

  @Post('/admin/edit/:idActivity/:idSchedule')
  async updateSchedulePost(
    @Session() session,
    @Res() res,
    @Query() queryParams,
    @Param() routeParams,
    @Body() bodyParams
  ){
    const errorMessage = 'Error Updating Schedule';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedSchedule;
    console.log(bodyParams);
    const hours = bodyParams.hours;
    let minutes = bodyParams.minutes;
    if(Number(minutes) < 10 && minutes.charAt(0) != '0'){
      minutes = `0${minutes}`
    }
    const capacity = bodyParams.capacity;
    let idActivity;
    let idSchedule;
    try{
      idActivity = Number(routeParams.idActivity);
      idSchedule = Number(routeParams.idSchedule);
      const updateScheduleDTO = new ScheduleUpdateDto();
      updateScheduleDTO.schedule  = `${hours}:${minutes}`;
      const errors : ValidationError[] = await validate(updateScheduleDTO);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to update Schedule';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach( err => {
          updateScheduleDTO[err.property] = undefined

        });
        const keys = Object.keys(updateScheduleDTO);
        keys.forEach(key =>{
          if(updateScheduleDTO[key] != undefined){
            queryParamsString = queryParamsString + `&${key}=${updateScheduleDTO[key]}`
          }
        });
        return res.redirect(`/schedules/admin/new/${idActivity}/${idSchedule}${queryParamsString}`)
      }else {
        const schedule = new ScheduleEntity();
        schedule.idSchedule = idSchedule;
        schedule.schedule = updateScheduleDTO.schedule;
        updatedSchedule = await this.schedulesService.create(schedule);
      }

    }catch (e) {
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }
    if(idActivity){
      if (updatedSchedule){
        return res.redirect('/schedules/admin/activity/'+ idActivity)
      }else{
        return res.redirect(`/schedules/admin/edit/${idActivity}/${idSchedule}?message=${errorMessage}`)
      }
    }else{
      return res.redirect('/activities/admin?message=Activity Not Found')
    }

  }


  @Post('/admin/new/:idActivity')
  async newSchedulePost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
    @Param() routeParams
  ){
    const errorMessage = 'Error Creating Schedule';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let createdSchedule;
    console.log(bodyParams);
    const hours = bodyParams.hours;
    let minutes = bodyParams.minutes;
    if(Number(minutes) < 10 && minutes.charAt(0) != '0'){
      minutes = `0${minutes}`
    }
    const capacity = bodyParams.capacity;
    let idActivity;
    try{
      idActivity = Number(routeParams.idActivity);
      const newSchedule = new ScheduleCreateDto();
      newSchedule.schedule  = `${hours}:${minutes}`;
      newSchedule.capacity = Number(capacity);
      newSchedule.activity = idActivity;
      newSchedule.status = true;
      const errors : ValidationError[] = await validate(newSchedule);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to create Schedule';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach( err => {
          newSchedule[err.property] = undefined
          newSchedule.activity = undefined
        });
        const keys = Object.keys(newSchedule);
        keys.forEach(key =>{
          if(newSchedule[key] != undefined){
            queryParamsString = queryParamsString + `&${key}=${newSchedule[key]}`
          }
        });
        return res.redirect('/schedules/admin/new/' + idActivity  + queryParamsString)
      }else {

        createdSchedule = await this.schedulesService.create(newSchedule);
      }

    }catch (e) {
      return res.redirect(`/schedules/admin/new/${idActivity}?message=${errorMessage}`)
    }
    if(idActivity){
      if (createdSchedule){
        return res.redirect('/schedules/admin/activity/'+ idActivity)
      }else{
        return res.redirect(`/schedules/admin/new/${idActivity}?message=${errorMessage}`)
      }
    }else{
      return res.redirect('/activities/admin?message=Activity Not Found')
    }


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
    const newSchedule = new ScheduleCreateDto();
    newSchedule.schedule = parametrosDeCuerpo.schedule;
    newSchedule.capacity = parametrosDeCuerpo.capacity;
    newSchedule.status = parametrosDeCuerpo.status;
    try {
      const errors : ValidationError[] = await validate(newSchedule);
      if(errors.length > 0){
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new Purchase')
      }else {
        return 'no errors'
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