import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Header, HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorInteface } from './author.inteface';
import { AuthorCreateDto } from './dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { AuthService } from '../auth/auth.service';

import { AuthorEntity } from './author.entity';
import { AuthorUpdateDto } from './dto/author.update-dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly _AuthorService: AuthorService,
              private readonly _authService: AuthService) {
  }
  @Get('/:idArtwork')
  getAuthors(

    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams
  ){
    //Render authors.ejs
    if(routeParams.idArtwork == 'admin'){
      this.adminAuthors(res, session, queryParams)
    }else{
      //Cualquier vuelta del client
    }

  }




  @Get('/admin/new')
  async newAuthor(
    @Session() session,
    @Res() res,
    @Query() queryParams,
  ){
    const errorMessage = 'Error Loading Authors';
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
    try{
      const newAuthor = new AuthorCreateDto();
      newAuthor.fullName = fullName;
      newAuthor.country = country;
      newAuthor.description = description;
      newAuthor.imagePath = 'image';
      newAuthor.status = true;
      const errors : ValidationError[] = await validate(newAuthor);
      if(errors.length > 0){
        const errorMessage = 'Failed to create Author';
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
        return res.redirect('/authors/admin/new' + queryParamsString)
      }else {
        createdAuthor = await this._AuthorService.create(newAuthor);
      }

    }catch (e) {
      return res.redirect(`/author/admin/new?message=${errorMessage}`)
    }
    if (createdAuthor){
      return res.redirect('/authors/admin')
    }else{
      return res.redirect(`/authors/admin/new?message=${errorMessage}`)
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
      author = await this._AuthorService.findOneByID(idAuthor)
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
          author
        }
      )
    }else{
      return res.redirect(`/authors/admin?message=${errorMessage}`)
    }

  }

  @Post('admin/edit/:id')
  async editAuthorAdminPost(
    @Session() session,
    @Res() res,
    @Param() routeParams,
    @Query() queryParams,
    @Body() bodyParams
  ){
    const errorMessage = 'Error Editing Author';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedAuthor;
    console.log(bodyParams);
    const fullName = bodyParams.fullName;
    const country = bodyParams.country;
    const description = bodyParams.description.toString().trim();
    const idAuthor = Number(routeParams.id);
    try{
      const newAuthor = new AuthorUpdateDto();
      newAuthor.fullName = fullName;
      newAuthor.country = country;
      newAuthor.description = description;
      newAuthor.imagePath = 'image';

      const errors : ValidationError[] = await validate(newAuthor);
      if(errors.length > 0){
        const errorMessage = 'Failed to create Author';
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

        updatedAuthor = await this._AuthorService.update(author);
      }

    }catch (e) {
      return res.redirect(`/authors/admin/edit/${idAuthor}?message=${errorMessage}`)
    }
    if (updatedAuthor){
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
      authors = await this._AuthorService.findAll()
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
      const author: AuthorEntity = await this._AuthorService.findOneByID(idAuthor);
      author.status = !author.status;
      updatedAuthor = await this._AuthorService.update(author)
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
  
  @Get('/:id') //Validar si es admin, renderizar admin/author.ejs with loaded data
  mostrarUno(
    @Param() parametrosDeRuta,
  ) {

  }
  @Get('new') //Validar si es admin
  createAuthor(){
      //Render author.ejs
  }

  @Post()
  async crearUno(
    @Body() parametrosDeCuerpo,
  ) {
    const newAuthor = new AuthorCreateDto();
    newAuthor.fullName = parametrosDeCuerpo.fullName;
    newAuthor.country = parametrosDeCuerpo.country;
    newAuthor.description = parametrosDeCuerpo.description;
    newAuthor.imagePath = parametrosDeCuerpo.imagePath;
    newAuthor.status = parametrosDeCuerpo.status;

    try {
      const errors : ValidationError[] = await validate(newAuthor)
      if(errors.length > 0){
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new Author')
      }else {
        return 'No errors'
      }
    }catch (e) {
        console.log(e);
      throw new BadRequestException('Errors validating input')
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
