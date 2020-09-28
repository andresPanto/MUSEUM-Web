import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Session } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthService } from '../auth/auth.service';
import { AuthorEntity } from '../author/author.entity';
import { ActivityEntity } from './activity.entity';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { ActivityCreateDto } from './dto/activity.create-dto';
import { AuthorUpdateDto } from '../author/dto/author.update-dto';
import { ActivityUpdateDto } from './dto/activity.update-dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly _activityService: ActivityService,
              private readonly _authService: AuthService) {
  }

  @Get('/:type')
  categoryActivities(
    @Session() session,
    @Res() res,
    @Query() queryParams,
    @Param() routeParams,
  ) {
    //Render template category.ejs
    if (routeParams.type == 'admin') {
      this.adminActivities(session, res, queryParams);
    } else {
      // Client side
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
        message: queryParams.message

      }
    )
  }

  @Post('/admin/new')
  async newAuthorPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams
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
      newActivity.imagePath = 'image';
      newActivity.status = true;

      const errors : ValidationError[] = await validate(newActivity);
      if(errors.length > 0){
        const errorMessage = 'Failed to create Activity';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach( err => {
          console.log(err.property)
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
          fullName: queryParams.fullName,
          country: queryParams.country,
          description: queryParams.description,
          message: queryParams.message,
          activity
        }
      )
    }else{
      return res.redirect(`/activities/admin?message=${errorMessage}`)
    }

  }

  @Post('admin/edit/:id')
  async editActivityAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams
  ){
    const errorMessage = 'Error Editing Activity';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedActivity;
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
      newActivity.imagePath = 'image';


      const errors : ValidationError[] = await validate(newActivity);
      if(errors.length > 0){
        const errorMessage = 'Failed to update Activity';
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

        updatedActivity = await this._activityService.update(activity);
      }

    }catch (e) {
      return res.redirect(`/activities/admin/edit/${idActivity}?message=${errorMessage}`)
    }
    if (updatedActivity){
      return res.redirect('/activities/admin')
    }else{
      return res.redirect(`/activities/admin/edit/${idActivity}?message=${errorMessage}`)
    }

  }

}