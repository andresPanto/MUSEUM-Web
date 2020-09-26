import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Session } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { AuthService } from '../auth/auth.service';

import { ArtworkEntity } from './artwork.entity';

import { validate, ValidationError } from 'class-validator';
import { ArtworkCreateDto } from './dto/artwork.create-dto';

import { ArtworkUpdateDto } from './dto/artwork.update-dto';

@Controller('artworks')
export class ArtworkController {
  constructor(private readonly artworksService: ArtworkService,
              private readonly _authService: AuthService) {
  }

  @Get('/:idActivity')
  mostrardeactivity(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
  ) {
    console.log('get Admin', routeParams.idActivity);
    //Render artworks.ejs
    if (routeParams.idActivity === 'admin') {
      console.log('Params es admin');
      this.adminArtworks(res, session, queryParams);
    } else {
      // la parte del cliente
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
      artworks = await this.artworksService.findAll();
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
      const artwork: ArtworkEntity = await this.artworksService.findOneByID(idArtwork);
      artwork.status = !artwork.status;
      updatedArtwork = await this.artworksService.update(artwork);
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
        message: queryParams.message,
      },
    );
  }


  @Post('/admin/new')
  async newArtworkPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
  ) {
    const errorMessage = 'Error Creating Artwork';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let createdArtwork;
    console.log(bodyParams);
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
      newArtwork.imagePath = 'image';
      newArtwork.status = true;

      const errors: ValidationError[] = await validate(newArtwork);
      if (errors.length > 0) {
        const errorMessage = 'Failed to create Artwork';
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
        return res.redirect('/artworks/admin/new' + queryParamsString);
      } else {
        createdArtwork = await this.artworksService.create(newArtwork);
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
      artwork = await this.artworksService.findOneByID(idArtwork);
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
          artwork,
        },
      );
    } else {
      return res.redirect(`/artworks/admin?message=${errorMessage}`);
    }

  }

  @Post('admin/edit/:id')
  async editArtworkAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams,
  ) {
    const errorMessage = 'Error Editing Artwork';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin) {
      return res.redirect('/users/admin');
    }
    let updatedArtwork;
    console.log(bodyParams);
    const name = bodyParams.name;
    const type = bodyParams.type;
    const year = bodyParams.year;
    const description = bodyParams.description.toString().trim();
    const idArtwork = Number(routeParams.id);
    try {
      const newArtwork = new ArtworkUpdateDto();
      newArtwork.name = name;
      newArtwork.type = type;
      newArtwork.year = year;
      newArtwork.description = description;
      newArtwork.imagePath = 'image';

      const errors: ValidationError[] = await validate(newArtwork);
      if (errors.length > 0) {
        const errorMessage = 'Failed to create Artwork';
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

        updatedArtwork = await this.artworksService.update(artwork);
      }

    } catch (e) {
      return res.redirect(`/artworks/admin/edit/${idArtwork}?message=${errorMessage}`);
    }
    if (updatedArtwork) {
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