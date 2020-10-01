import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorCreateDto } from './dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { AuthService } from '../auth/auth.service';
import { diskStorage } from 'multer';
import { AuthorEntity } from './author.entity';
import { AuthorUpdateDto } from './dto/author.update-dto';
import { ArtworkAuthorService } from 'src/artwork-author/artwork-author.service';
import { ActivityService } from 'src/activity/activity.service';
import { ArtworkService } from 'src/artwork/artwork.service';

//import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
const fs = require('fs')
var path = require('path');
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Controller('authors')
export class AuthorController {
  constructor(private readonly _authorService: AuthorService,
    private readonly _artworkAuthorService: ArtworkAuthorService,
    private readonly _activityService: ActivityService,
    private readonly _artworkService: ArtworkService,
    private readonly _authService: AuthService) {
  }
  @Get('/:idActivity/:idArtwork')
  async getAuthors(
    @Param() route,
    @Res() res,
    @Session() session,
    @Query() queryParams
  ){
    if(route.idActivity == 'admin'){
      this.adminAuthors(res, session, queryParams)
    }else{
    let username;
        if(typeof session.username != 'undefined'){
          username = session.username
        }
    const idArtwork = route.idArtwork;
    const idActivity = route.idActivity;
    if(!isNaN(idArtwork) && !isNaN(idActivity)){
        try{
          const idActivity = route.idActivity;
              let activity = await this._activityService.getActivity(Number(idActivity));
              let registry = await this._artworkAuthorService.getArtworkAuthors(Number(idArtwork));  
              let artwork = await this._artworkService.getArtwork(Number(idArtwork));     
              let idsAuthors = []
              registry.forEach(element => {
                idsAuthors.push(element['authorIdAuthor']);
              });
              let authors = await this._authorService.getAuthors(idsAuthors);
              res.render('module_client/authors',{username:username, activity: activity, artwork: artwork, authorsArray: authors})
          
        } catch(e){
          console.log("Error artwork: ",e);
          throw new NotFoundException('Error while getting authors.');
        }
    }else{
      throw new NotFoundException('Invalid artwork.');
    }
    }


  }


  @Get('/admin')
  async getAuthorsAdmin(
    @Param() route,
    @Res() res,
    @Session() session,
    @Query() queryParams
  ) {
    this.adminAuthors(res, session, queryParams)
  }



  @Get('/new')
  async newAuthor(
    @Session() session,
    @Res() res,
    @Query() queryParams,
  ){

    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    return res.render(
      'module_admin/author',
      {
        username: session.username,
        fullName: queryParams.fullName,
        country: queryParams.country,
        description: queryParams.description,
        imagePath: queryParams.imagePath,
        message: queryParams.message
      }
    )
  }




  // noinspection TypeScriptValidateTypes
  @Post('/admin/new')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/authors/',
    }),
  }))
  async newAuthorPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
    @UploadedFile() avatar,
  ){

    const errorMessage = 'Error Creating Author';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let createdAuthor;
    console.log(bodyParams);
    const fullName = bodyParams.fullName;
    const country = bodyParams.country;
    const description = bodyParams.description.toString().trim();
    console.log('avatar', avatar)
    try{
      const newAuthor = new AuthorCreateDto();
      newAuthor.fullName = fullName;
      newAuthor.country = country;
      newAuthor.description = description;
      if(typeof  avatar !== 'undefined'){
        newAuthor.imagePath = '/images/authors/' + avatar.filename;
      }else{
        newAuthor.imagePath = undefined
      }
      newAuthor.status = true;
      const errors : ValidationError[] = await validate(newAuthor);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to create Author';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        newAuthor.imagePath = undefined;
        errors.forEach( err => {
          newAuthor[err.property] = undefined
        });
        const keys = Object.keys(newAuthor);
        keys.forEach(key =>{
          if(newAuthor[key] != undefined){
            queryParamsString = queryParamsString + `&${key}=${newAuthor[key]}`
          }
        });
        return res.redirect('/authors/new' + queryParamsString)
      }else {
        createdAuthor = await this._authorService.create(newAuthor);
      }

    }catch (e) {
      return res.redirect(`/author/new?message=${errorMessage}`)
    }
    if (createdAuthor){
      return res.redirect('/authors/admin')
    }else{
      return res.redirect(`/authors/new?message=${errorMessage}`)
    }

  }

  @Get('admin/edit/:id')
  async editAuthorAdmin(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams
  ){
    const errorMessage = 'Error Editing Author';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let author;
    try{
      const idAuthor = Number(routeParams.id);
      author = await this._authorService.findOneByID(idAuthor)
    }catch (e) {
      console.log(e);
      return res.redirect(`/authors/admin?message=${errorMessage}`)
    }
    if(author){
      return res.render(
        'module_admin/author',
        {
          username: session.username,
          fullName: queryParams.fullName,
          country: queryParams.country,
          description: queryParams.description,
          message: queryParams.message,
          author,
          imagePath: queryParams.imagePath
        }
      )
    }else{
      return res.redirect(`/authors/admin?message=${errorMessage}`)
    }

  }

  // noinspection TypeScriptValidateTypes
  @Post('admin/edit/:id')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'public/images/authors/',
    }),
  }))
  async editAuthorAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams,
    @UploadedFile() avatar
  ){
    const errorMessage = 'Error Editing Author';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedAuthor;
    let prevoiusImage;
    console.log(bodyParams);
    const fullName = bodyParams.fullName;
    const country = bodyParams.country;
    const description = bodyParams.description.toString().trim();
    const idAuthor = Number(routeParams.id);
    const imageExists = typeof  avatar !== 'undefined'
    try{
      const newAuthor = new AuthorUpdateDto();
      newAuthor.fullName = fullName;
      newAuthor.country = country;
      newAuthor.description = description;
      if(imageExists){
        newAuthor.imagePath = '/images/authors/' + avatar.filename;
      }else{
        newAuthor.imagePath = undefined
      }
      const errors : ValidationError[] = await validate(newAuthor);
      if(errors.length > 0){
        const errorMessage = 'Data not valid to update Author';
        let queryParamsString = `?message=${errorMessage}`;
        console.log('Errors', errors);
        errors.forEach( err => {
          newAuthor[err.property] = undefined
        });
        const keys = Object.keys(newAuthor);
        keys.forEach(key =>{
          if(newAuthor[key] != undefined){
            queryParamsString = queryParamsString + `&${key}=${newAuthor[key]}`
          }
        });
        return res.redirect(`/authors/admin/edit/${idAuthor}` + queryParamsString)
      }else {
        const author  = new AuthorEntity();

          author.idAuthor = idAuthor;
          author.fullName = newAuthor.fullName;
          author.country = newAuthor.country;
          author.description = newAuthor.description;
          author.imagePath = newAuthor.imagePath;
        const previuosAuthor = await this._authorService.findOneByID(author.idAuthor)
        prevoiusImage = previuosAuthor.imagePath;
        updatedAuthor = await this._authorService.update(author);
      }

    }catch (e) {
      return res.redirect(`/authors/admin/edit/${idAuthor}?message=${errorMessage}`)
    }

    if (updatedAuthor){
      if(imageExists && prevoiusImage){

        console.log('dirname', __dirname);
        try {
          const pathName = path.join(__dirname,'..', '..', 'public', prevoiusImage)
          console.log('pathName', pathName)
          fs.unlinkSync(pathName)
        }catch (e) {
          console.log(e)
        }

      }
      return res.redirect('/authors/admin')
    }else{
      return res.redirect(`/authors/admin/edit/${idAuthor}?message=${errorMessage}`)
    }


  }

  /// No renderizaaaaaa
   //Validar si es admin
  async adminAuthors(
     res,
     session,
     queryParams
  ) {
    const errorMessage = 'Error Loading Authors';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let authors;
    try {
      authors = await this._authorService.findAll()
    }catch (e) {
      console.log(e);
      return res.redirect(`/authors/admin?message=${errorMessage}`)
    }
    if (authors){
      return res.render(
        'module_admin/authors',
        {
          username: session.username,
          message: queryParams.message,
          authors
        }
      )
    }else{
      return res.redirect(`/authors/admin?message=${errorMessage}`)
    }
  }

  @Get('/admin/status/:id')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams
  ){
    console.log('author status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change author status';
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedAuthor;
    try {
      const idAuthor = Number(routePrams.id);
      const author: AuthorEntity = await this._authorService.findOneByID(idAuthor);
      author.status = !author.status;
      updatedAuthor = await this._authorService.update(author)
    }catch (e) {
      console.log(e);
      return res.redirect(`/authors/admin?message=${message}`)
    }
    if (updatedAuthor){
      return res.redirect('/authors/admin')
    }else{
      return res.redirect(`/authors/admin?message=${message}`)
    }
  }
  

}
