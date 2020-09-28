import { Body, Controller, Delete, Get, Param, Post, Put, Res, NotFoundException } from '@nestjs/common';
import { ActivityArtworkService } from 'src/activity-artwork/activity-artwork.service';
import { ActivityService } from 'src/activity/activity.service';
import { ArtworkService } from './artwork.service';

@Controller('artworks')
export class ArtworkController {
  constructor(private readonly _artworksService: ArtworkService,
    private readonly _activityArtworkService: ActivityArtworkService,
    private readonly _activityService: ActivityService) {
  }
    @Get('/:idActivity')
    async getActivityArtworks(
      @Param() route,
      @Res() res
    ){
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
              res.render('module_client/artworks',{logged_in:false, activity: activity, artworksArray: artworks})
          
          }catch(e){
            console.log("Error artwork: ",e);
            throw new NotFoundException('Error while getting artworks.');
          }
        }else{
          throw new NotFoundException('There are no artworks matching this activity.');
        }
        //Render artworks.ejs
    }
    @Get() //Validar si es admin
    mostrarTodos() {
        //Render admin/artworks.ejs
    }
    @Get('new')
    crearArtwork(){
      //Render artwork.ejs
    }

    @Post()
    crearUno(
      @Body() parametrosDeCuerpo
    ){

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