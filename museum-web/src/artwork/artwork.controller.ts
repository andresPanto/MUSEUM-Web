import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  NotFoundException,
  Session,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ActivityArtworkService } from 'src/activity-artwork/activity-artwork.service';
import { ActivityService } from 'src/activity/activity.service';
  
import { ArtworkService } from './artwork.service';
import { AuthService } from '../auth/auth.service';

import { ArtworkEntity } from './artwork.entity';

import { validate, ValidationError } from 'class-validator';
import { ArtworkCreateDto } from './dto/artwork.create-dto';

import { ArtworkUpdateDto } from './dto/artwork.update-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const fs = require('fs');
var path = require('path');

@Controller('artworks')
export class ArtworkController {
  constructor(private readonly _artworksService: ArtworkService,
    private readonly _activityArtworkService: ActivityArtworkService,
    private readonly _activityService: ActivityService,
    private readonly _authService: AuthService) {
  }

  @Get('/:idActivity')
  async mostrardeactivity(
    @Param() route,
      @Res() res,
      @Session() session,
    @Query() queryParams,
  ) {

    //Render artworks.ejs
    if (route.idActivity === 'admin') {
      console.log('Params es admin');
      this.adminArtworks(res, session, queryParams);
    } else {
      // la parte del cliente
   
      let username;
        if(typeof session.username != 'undefined'){
          username = session.username
        }
        if (!isNaN(route.idActivity)){
          try{
              //TODO: Refactorize this
              const idActivity = route.idActivity;
              let activity = await this._activityService.getActivity(Number(idActivity));
              let registry = await this._activityArtworkService.getActivityArtworks(idActivity);          
              let idsArtworks = []
              registry.forEach(element => {
                idsArtworks.push(element['artworkIdArtwork']);
              });
              let artworks = await this._artworksService.getArtworks(idsArtworks);
              res.render('module_client/artworks',{username:username, activity: activity, artworksArray: artworks})
          
          }catch(e){
            console.log("Error artwork: ",e);
            throw new NotFoundException('Error while getting artworks.');
          }
        }else{
          throw new NotFoundException('There are no artworks matching this activity.');
        }
        //Render artworks.ejs
    }

  }

  async adminArtworks(
    res,
    session,
    queryParams,
  ) {
    const errorMessage = 'Error Loading Artworks';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let artworks;
    try {
      artworks = await this._artworksService.findAll();
    } catch (e) {
      console.log(e);
      return res.redirect(`/artworks/admin?message=${errorMessage}`);
    }

    if (artworks) {
      return res.render(
        'module_admin/artworks',
        {
          username: session.username,
          message: queryParams.message,
          artworks,
        },
      );
    } else {
      return res.redirect(`/artworks/admin?message=${errorMessage}`);
    }
  }
  
  @Get('/admin/status/:id')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams,
  ) {
    console.log('author status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change artwork status';
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let updatedArtwork;
    try {
      const idArtwork = Number(routePrams.id);
      const artwork: ArtworkEntity = await this._artworksService.findOneByID(idArtwork);
      artwork.status = !artwork.status;
      updatedArtwork = await this._artworksService.update(artwork);
    } catch (e) {
      console.log(e);
      return res.redirect(`/artworks/admin?message=${message}`);
    }
    if (updatedArtwork) {
      return res.redirect('/artworks/admin');
    } else {
      return res.redirect(`/artworks/admin?message=${message}`);
    }
  }

  // noinspection TypeScriptValidateTypes
  @Get('/admin/new')

  async newArtwork(
    @Session() session,
    @Res() res,
    @Query() queryParams,
  ) {

    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    return res.render(
      'module_admin/artwork',
      {
        username: session.username,
        name: queryParams.name,
        year: queryParams.year,
        type: queryParams.type,
        description: queryParams.description,
        imagePath: queryParams.imagePath,
        message: queryParams.message,
      },
    );
  }

// noinspection TypeScriptValidateTypes
  @Post('/admin/new')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/artworks/',
    }),
  }))
  async newArtworkPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
    @UploadedFile() avatar,
  ) {
    const errorMessage = 'Error Creating Artwork';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let createdArtwork;
    console.log(bodyParams);
    console.log('avatar', avatar);
    const name = bodyParams.name;
    const year = bodyParams.year;
    const type = bodyParams.type;
    const description = bodyParams.description.toString().trim();
    try {
      const newArtwork = new ArtworkCreateDto();
      newArtwork.name = name;
      newArtwork.year = year;
      newArtwork.type = type;
      newArtwork.description = description;
      if (typeof avatar !== 'undefined') {
        newArtwork.imagePath = '/images/artworks/' + avatar.filename;
      } else {
        newArtwork.imagePath = undefined;
      }
      newArtwork.status = true;

      const errors: ValidationError[] = await validate(newArtwork);
      if (errors.length > 0) {
        const errorMessage = 'Data not valid to create Artwork';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        newArtwork.imagePath = undefined;
        errors.forEach(err => {
          newArtwork[err.property] = undefined;
        });
        const keys = Object.keys(newArtwork);
        keys.forEach(key => {
          if (newArtwork[key] != undefined) {
            queryParamsString = queryParamsString + `&${key}=${newArtwork[key]}`;
          }
        });
        return res.redirect('/artworks/admin/new' + queryParamsString);
      } else {
        createdArtwork = await this._artworksService.create(newArtwork);
      }

    } catch (e) {
      return res.redirect(`/author/admin/new?message=${errorMessage}`);
    }
    if (createdArtwork) {
      return res.redirect('/artworks/admin');
    } else {
      return res.redirect(`/artworks/admin/new?message=${errorMessage}`);
    }

  }

  @Get('admin/edit/:id')
  async editArtworkAdmin(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
  ) {
    const errorMessage = 'Error Editing Artwork';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let artwork;
    try {
      const idArtwork = Number(routeParams.id);
      artwork = await this._artworksService.findOneByID(idArtwork);
    } catch (e) {
      console.log(e);
      return res.redirect(`/artworks/admin?message=${errorMessage}`);
    }
    if (artwork) {
      return res.render(
        'module_admin/artwork',
        {
          username: session.username,
          name: queryParams.name,
          year: queryParams.year,
          type: queryParams.type,
          description: queryParams.description,
          message: queryParams.message,
          imagePath: queryParams.imagePath,
          artwork,
        },
      );
    } else {
      return res.redirect(`/artworks/admin?message=${errorMessage}`);
    }

  }

  // noinspection TypeScriptValidateTypes
  @Post('admin/edit/:id')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/artworks/',
    }),
  }))
  async editArtworkAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams,
    @UploadedFile() avatar,
  ) {
    const errorMessage = 'Error Editing Artwork';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let updatedArtwork;
    let prevoiusImage;
    console.log(bodyParams);
    const name = bodyParams.name;
    const type = bodyParams.type;
    const year = bodyParams.year;
    const description = bodyParams.description.toString().trim();
    const idArtwork = Number(routeParams.id);
    const imageExists = typeof avatar !== 'undefined';
    try {
      const newArtwork = new ArtworkUpdateDto();
      newArtwork.name = name;
      newArtwork.type = type;
      newArtwork.year = year;
      newArtwork.description = description;
      if (imageExists) {
        newArtwork.imagePath = '/images/authors/' + avatar.filename;
      } else {
        newArtwork.imagePath = undefined;
      }

      const errors: ValidationError[] = await validate(newArtwork);
      if (errors.length > 0) {
        const errorMessage = 'Data not valid to update Artwork';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach(err => {
          newArtwork[err.property] = undefined;
        });
        const keys = Object.keys(newArtwork);
        keys.forEach(key => {
          if (newArtwork[key] != undefined) {
            queryParamsString = queryParamsString + `&${key}=${newArtwork[key]}`;
          }
        });
        return res.redirect(`/artworks/admin/edit/${idArtwork}` + queryParamsString);
      } else {
        const artwork = new ArtworkEntity();

        artwork.idArtwork = idArtwork;
        artwork.name = newArtwork.name;
        artwork.type = newArtwork.type;
        artwork.year = newArtwork.year;
        artwork.description = newArtwork.description;
        artwork.imagePath = newArtwork.imagePath;
        const previuosArtwork = await this._artworksService.findOneByID(artwork.idArtwork);
        prevoiusImage = previuosArtwork.imagePath;
        updatedArtwork = await this._artworksService.update(artwork);
      }

    } catch (e) {
      return res.redirect(`/artworks/admin/edit/${idArtwork}?message=${errorMessage}`);
    }
    if (updatedArtwork) {
      if (imageExists && prevoiusImage) {

        console.log('dirname', __dirname);
        try {
          const pathName = path.join(__dirname, '..', '..', 'public', prevoiusImage);
          console.log('pathName', pathName);
          fs.unlinkSync(pathName);
        } catch (e) {
          console.log(e);
        }
      }
      return res.redirect('/artworks/admin');
    } else {
      return res.redirect(`/artworks/admin/edit/${idArtwork}?message=${errorMessage}`);
    }

  }


  @Get() //Validar si es admin
  mostrarTodos() {
    //Render admin/artworks.ejs
  }

  @Get('new')
  crearArtwork() {
    //Render artwork.ejs
  }

}