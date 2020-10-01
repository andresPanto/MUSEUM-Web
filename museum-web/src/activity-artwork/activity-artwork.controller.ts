import { Body, Controller, Get, Param, Post, Res, Session } from '@nestjs/common';
import { arrayContains } from 'class-validator';
import { ActivityService } from 'src/activity/activity.service';
import { ArtworkService } from 'src/artwork/artwork.service';
import { AdvancedConsoleLogger } from 'typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';
import { ActivityArtworkService } from './activity-artwork.service';

@Controller('activity-artworks')
export class ActivityArtworkController {
  constructor(private readonly _activityArtworkService: ActivityArtworkService,
    private readonly _activityService: ActivityService,
    private readonly _artworkService: ArtworkService) {
  }
  @Get('/:idActivity')
  async actart(
    @Res() res,
    @Param() route,
    @Session() session
  ){
    try{
      if(!isNaN(route.idActivity)){
        const idActivity = Number(route.idActivity);
        let activity = await this._activityService.getActivity(idActivity);
        if(activity){
          let actArtworks =  await this._activityArtworkService.getActivityAndArtworks(idActivity);
          //To get only the artworks;
          let artworks = [];
          for(var entity of actArtworks){
            artworks.push(entity.artwork)
          }
          //Get all artworks in the database
          let allArtworks = await this._artworkService.getAllArtworks();
         //Delete the ones that are already assigned to the activity
         if(artworks.length > 0){
          for (var i = allArtworks.length - 1; i >= 0; i--) {
            for (var j = 0; j < artworks.length; j++) {
              if (JSON.stringify(allArtworks[i]) === JSON.stringify(artworks[j])) {
                allArtworks.splice(i, 1);
                }
              }
            }
          }
          res.render('module_admin/activity-artworks', {
            arrayArtworks: artworks,
            activity: activity,
            allArtworks: allArtworks,
            username: session.username});
        }
        
      }
      
    }catch(e){
      console.log("Error: ",e );
      res.redirect('back');
    }
  
    //

  }
  @Post('remove')
  async ajaxr(
    @Res() res,
    @Body() body
  ){
    const idArtwork = Number(body.artwork);
    const idActivity = Number(body.activity);
    try{
      let actart = await this._activityArtworkService.deleteRelation(idActivity, idArtwork);
      if(actart){
        res.send(true);
      }else{
        res.send(false);
      }
      
    }catch(e){
      console.log("Error deleting activity-artwork: ", e);
      res.send(false);
    }
    
  }
  @Post('save')
  async ajaxs(
    @Res() res,
    @Body() body
  ){
    const idArtwork = Number(body.artwork);
    const idActivity = Number(body.activity);
    try{
      let artwork = await this._artworkService.getArtwork(idArtwork);
      let activity = await this._activityService.getActivity(idActivity);
      var actart = new ActivityArtworkEntity();
      actart.activity = activity;
      actart.artwork = artwork;
      let response = this._activityArtworkService.saveRelation(actart);
      if(response){
        res.send(true);
      }else{
        res.send(false);
      }
    }catch (e){
      console.log("Error saving activity-artwork: ", e);
      res.send(false);
    }
    
  }
}