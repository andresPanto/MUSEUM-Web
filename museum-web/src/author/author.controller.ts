import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res, NotFoundException, Session } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorCreateDto } from './dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { ArtworkAuthorService } from 'src/artwork-author/artwork-author.service';
import { ActivityService } from 'src/activity/activity.service';
import { ArtworkService } from 'src/artwork/artwork.service';


@Controller('authors')
export class AuthorController {
  constructor(private readonly _authorService: AuthorService,
    private readonly _artworkAuthorService: ArtworkAuthorService,
    private readonly _activityService: ActivityService,
    private readonly _artworkService: ArtworkService) {
  }
  @Get('/:idActivity/:idArtwork')
  async getAuthors(
    @Param() route,
    @Res() res,
    @Session() session
  ){
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
    //Render authors.ejs
  }
  @Get() //Validar si es admin
  mostrarTodos() {
      //Render admin/authors.ejs
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
