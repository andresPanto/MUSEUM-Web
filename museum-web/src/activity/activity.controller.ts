import {
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
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthService } from '../auth/auth.service';

import { ActivityEntity } from './activity.entity';

import { validate, ValidationError } from 'class-validator';
import { ActivityCreateDto } from './dto/activity.create-dto';

import { diskStorage } from 'multer';
import { ActivityUpdateDto } from './dto/activity.update-dto';
import { FileInterceptor } from '@nestjs/platform-express';
const fs = require('fs');
var path = require('path');


@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService,
              private readonly _authService: AuthService) {
  }


@Get('/:type')
  async categoryActivities(
    @Res() res,
    @Param() route,
    @Query() query,
    @Session() session
  ){
      if (route.type == 'admin') {
      this.adminActivities(session, res, query);
    }else{
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
        
  }

  @Get('/admin/new')
  async newActivity(
    @Session() session,
    @Res() res,
    @Query() queryParams,
  ){

    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    return res.render(
      'module_admin/activity',
      {
        username: session.username,
        //Poner los datos de la actividad :c
        name: queryParams.name,
        type: queryParams.type,
        pmName: queryParams.pmName,
        pmPhoneNumber: queryParams.pmPhoneNumber,
        price: queryParams.price,
        location: queryParams.location,
        initialDate: queryParams.initialDate,
        finalDate: queryParams.finalDate,
        duration: queryParams.duration,
        description: queryParams.description,
        imagePath: queryParams.imagePath,
        message: queryParams.message

      }
    )
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

  // noinspection TypeScriptValidateTypes
  @Post('/admin/new')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/activities/',
    }),
  }))
  async newActivityPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
    @UploadedFile() avatar,
  ){
    const errorMessage = 'Error Creating Activity';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let createdActivity;
    console.log(bodyParams);
    const name = bodyParams.name;
    const type = bodyParams.type;
    const duration = bodyParams.duration;
    const pmName = bodyParams.pmName;
    const pmPhoneNumber = bodyParams.pmPhoneNumber;
    const initialDate = new Date(bodyParams.initialDate);
    const finalDate = new Date(bodyParams.finalDate);
    const location = bodyParams.location;
    const price = Number(bodyParams.price);


    const description = bodyParams.description.toString().trim();
    try{
      const newActivity = new ActivityCreateDto();
      finalDate.setDate(finalDate.getDate() + 1);
      initialDate.setDate(initialDate.getDate() + 1);
      newActivity.name = name;
      newActivity.type = type;
      newActivity.pmName = pmName;
      newActivity.pmPhoneNumber = pmPhoneNumber;
      newActivity.price = price;
      newActivity.location = location;

      newActivity.finalDate = finalDate;
      newActivity.initialDate = initialDate;
      newActivity.duration = duration;
      newActivity.description = description;
      if(typeof  avatar !== 'undefined'){
        newActivity.imagePath = '/images/activities/' + avatar.filename;
      }else{
        newActivity.imagePath = undefined
      }
      newActivity.status = true;

      const errors : ValidationError[] = await validate(newActivity);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to create Activity';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        newActivity.imagePath = undefined;
        errors.forEach( err => {
          console.log(err.property);
           newActivity[err.property] = undefined

        });
        const keys = Object.keys(newActivity);
        keys.forEach(key =>{

          if(newActivity[key] != undefined){

            if(newActivity[key] instanceof Date){
              const date = newActivity[key],
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                 day = ("0" + date.getDate()).slice(-2);
              newActivity[key] = [date.getFullYear(), mnth, day].join("-");
            }
            queryParamsString = queryParamsString + `&${key}=${newActivity[key]}`
            queryParamsString = queryParamsString.replace('+', '%2B');
            console.log(queryParamsString)
          }
        });
        return res.redirect('/activities/admin/new' + queryParamsString)
      }else {
        createdActivity = await this._activityService.create(newActivity);
      }

    }catch (e) {
      return res.redirect(`/activities/admin/new?message=${errorMessage}`)
    }
    if (createdActivity){
      return res.redirect('/activities/admin')
    }else{
      return res.redirect(`/activities/admin/new?message=${errorMessage}`)
    }

  }





  async adminActivities(
    session,
    res,
    queryParams,
  ) {
    const errorMessage = 'Error Loading Activities';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let activities;
    try {
      activities = await this._activityService.findAll();
    } catch (e) {
      console.log(e);
      return res.redirect(`/activities/admin?message=${errorMessage}`);
    }
    if (activities) {
      return res.render(
        'module_admin/activities',
        {
          username: session.username,
          message: queryParams.message,
          activities,
        },
      );
    } else {
      return res.redirect(`/activities/admin?message=${errorMessage}`);
    }
  }




  @Get('/admin/status/:id')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams
  ){
    console.log('activity status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change activity status';
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedActivity;
    try {
      const idActivity = Number(routePrams.id);
      const activity: ActivityEntity = await this._activityService.findOneByID(idActivity);
      activity.status = !activity.status;
      updatedActivity = await this._activityService.update(activity)
    }catch (e) {
      console.log(e);
      return res.redirect(`/activities/admin?message=${message}`)
    }
    if (updatedActivity){
      return res.redirect('/activities/admin')
    }else{
      return res.redirect(`/activities/admin?message=${message}`)
    }
  }





  @Get('Queryparam')
  searchActivity() {
    //Render activity.ejs with queryparam
  }

  @Get()
  mostrarTodos() {
    //Render activities.ejs
  }

  @Get('new')
  crear() {
    //Render activity.ejs
  }

  @Get('/admin/edit/:id')
  async editar(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams
  ) {
    const errorMessage = 'Error Editing Activity';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let activity;
    try{
      const idActivity = Number(routeParams.id);
      activity = await this._activityService.findOneByID(idActivity)
    }catch (e) {
      console.log(e);
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }
    if(activity){
      return res.render(
        'module_admin/activity',
        {
          username: session.username,
          name: queryParams.name,
          type: queryParams.type,
          pmName: queryParams.pmName,
          pmPhoneNumber: queryParams.pmPhoneNumber,
          price: queryParams.price,
          location: queryParams.location,
          initialDate: queryParams.initialDate,
          finalDate: queryParams.finalDate,
          duration: queryParams.duration,
          description: queryParams.description,
          imagePath: queryParams.imagePath,
          message: queryParams.message,
          activity
        }
      )
    }else{
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }

  }

  // noinspection TypeScriptValidateTypes
  @Post('admin/edit/:id')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/activities/',
    }),
  }))
  async editActivityAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams,
    @UploadedFile() avatar
  ){
    const errorMessage = 'Error Editing Activity';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedActivity;
    let prevoiusImage;
    console.log(bodyParams);
    const idActivity = Number(routeParams.id);
    const name = bodyParams.name;
    const type = bodyParams.type;
    const duration = bodyParams.duration;
    const pmName = bodyParams.pmName;
    const pmPhoneNumber = bodyParams.pmPhoneNumber;
    const initialDate = new Date(bodyParams.initialDate);
    const finalDate = new Date(bodyParams.finalDate);
    const location = bodyParams.location;
    const price = Number(bodyParams.price);
    const imageExists = typeof  avatar !== 'undefined'


    const description = bodyParams.description.toString().trim();
    try{
      const newActivity = new ActivityUpdateDto();
      finalDate.setDate(finalDate.getDate() + 1);
      initialDate.setDate(initialDate.getDate() + 1);
      newActivity.name = name;
      newActivity.type = type;
      newActivity.pmName = pmName;
      newActivity.pmPhoneNumber = pmPhoneNumber;
      newActivity.price = price;
      newActivity.location = location;

      newActivity.finalDate = finalDate;
      newActivity.initialDate = initialDate;
      newActivity.duration = duration;
      newActivity.description = description;
      if(imageExists){
        newActivity.imagePath = '/images/activities/' + avatar.filename;
      }else{
        newActivity.imagePath = undefined
      }


      const errors : ValidationError[] = await validate(newActivity);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to update Activity';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach( err => {
          console.log(err.property);
          newActivity[err.property] = undefined

        });
        const keys = Object.keys(newActivity);
        keys.forEach(key =>{

          if(newActivity[key] != undefined){

            if(newActivity[key] instanceof Date){
              const date = newActivity[key],
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
              newActivity[key] = [date.getFullYear(), mnth, day].join("-");
            }
            queryParamsString = queryParamsString + `&${key}=${newActivity[key]}`
            queryParamsString = queryParamsString.replace('+', '%2B');
            console.log(queryParamsString)
          }
        });
        return res.redirect(`/activities/admin/edit/${idActivity}` + queryParamsString)

      }else {
        const activity  = new ActivityEntity();

        activity.idActivity = idActivity;
        activity.name = newActivity.name;
        activity.type = newActivity.type;
        activity.location = newActivity.location;
        activity.initialDate = newActivity.initialDate;
        activity.finalDate = newActivity.finalDate;
        activity.description = newActivity.description;
        activity.duration = newActivity.duration;
        activity.pmName = newActivity.pmName;
        activity.pmPhoneNumber = newActivity.pmPhoneNumber;
        activity.price = newActivity.price;
        activity.imagePath = newActivity.imagePath;
        const previousActivity = await this._activityService.findOneByID(activity.idActivity)
        prevoiusImage = previousActivity.imagePath;
        updatedActivity = await this._activityService.update(activity);
      }

    }catch (e) {
      return res.redirect(`/activities/admin/edit/${idActivity}?message=${errorMessage}`)
    }
    if (updatedActivity){
      if(imageExists && prevoiusImage){
        console.log('dirname', __dirname);
        try {
          const pathName = path.join(__dirname,'..', '..', 'public', prevoiusImage)

          fs.unlinkSync(pathName)
        }catch (e) {
          console.log(e)
        }
      }
      return res.redirect('/activities/admin')
    }else{
      return res.redirect(`/activities/admin/edit/${idActivity}?message=${errorMessage}`)
    }

  }

}