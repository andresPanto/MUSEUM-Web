import { Controller, Res, Get, Param, Session, Post, Body } from '@nestjs/common';
import { ArtworkService } from 'src/artwork/artwork.service';
import { AuthorService } from 'src/author/author.service';
import { ArtworkAuthorEntity } from './artwork-author.entity';
import { ArtworkAuthorService } from './artwork-author.service';

@Controller('artwork-authors')
export class ArtworkAuthorsController {
  constructor(private readonly _artworkAuthorsService: ArtworkAuthorService,
    private readonly _artworkService: ArtworkService,
    private readonly _authorService: AuthorService) {
  }
  @Get('/:idArtwork')
  async actart(
    @Res() res,
    @Param() route,
    @Session() session
  ){
    try{
      if(!isNaN(route.idArtwork)){
        const idArtwork = Number(route.idArtwork);
        let artwork = await this._artworkService.getArtwork(idArtwork);
        if(artwork){
          let artAuthors =  await this._artworkAuthorsService.getArtworkAndAuthors(idArtwork);
          //To get only the authors;
          let authors = [];
          for(var entity of artAuthors){
            authors.push(entity.author)
          }
          
          //Get all authors in the database
          let allAuthors = await this._authorService.getAllAuthors();
         //Delete the ones that are already assigned to the artwork
         if(authors.length > 0){
          for (var i = allAuthors.length - 1; i >= 0; i--) {
            for (var j = 0; j < authors.length; j++) {
              if (JSON.stringify(allAuthors[i]) === JSON.stringify(authors[j])) {
                allAuthors.splice(i, 1);
                }
              }
            }
          }
          res.render('module_admin/artworks-authors', {
          username: session.username,
          arrayAuthors: authors, artwork: artwork, allAuthors: allAuthors});
        }
        
      }
      
    }catch(e){
      console.log("Error: ",e );
      res.redirect('back');
    }
  }

  @Post('remove')
  async ajaxr(
    @Res() res,
    @Body() body
  ){
    const idAuthor = Number(body.author);
    const idArtwork = Number(body.artwork);
    try{
      let actart = await this._artworkAuthorsService.deleteRelation(idArtwork, idAuthor);
      if(actart){
        res.send(true);
      }else{
        res.send(false);
      } 
    }catch(e){
      console.log("Error deleting artwork-author: ", e);
      res.send(false);
    } 
  }

  @Post('save')
  async ajaxs(
    @Res() res,
    @Body() body
  ){
    const idAuthor = Number(body.author);
    const idArtwork = Number(body.artwork);
    try{
      let author = await this._authorService.getAuthor(idAuthor);
      let artwork = await this._artworkService.getArtwork(idArtwork);
      var artauth = new ArtworkAuthorEntity();
      artauth.artwork = artwork;
      artauth.author = author;
      let response = this._artworkAuthorsService.saveRelation(artauth);
      if(response){
        res.send(true);
      }else{
        res.send(false);
      }
    }catch (e){
      console.log("Error saving artwork-author: ", e);
      res.send(false);
    }
    
  }

}