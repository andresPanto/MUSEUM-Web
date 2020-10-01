import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkEntity } from 'src/artwork/artwork.entity';
import { Repository } from 'typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';

@Injectable()
export class ActivityArtworkService {
  constructor(@InjectRepository(ActivityArtworkEntity) private readonly _activityArtworkRepository: Repository<ActivityArtworkEntity>) {
  }
  //Obtain the id of  all of the artworks of a given activity
  getActivityArtworks(idActivity: number){
    return this._activityArtworkRepository.createQueryBuilder("activity_artwork").
    select("artworkIdArtwork").
    where("activityIdActivity = :id",{id: idActivity}).
    getRawMany();
  }
  //Get all the artworks (entities) from a given activity;
  getActivityAndArtworks(idActivity: number){
    return this._activityArtworkRepository.createQueryBuilder("activity_artwork").
    leftJoinAndSelect("activity_artwork.artwork", "artwork").
    where("activityIdActivity = :id", {id: idActivity}).
    getMany();
  }
  //Save a new relation between activity and artwork.
  saveRelation(actart: ActivityArtworkEntity){
    return this._activityArtworkRepository.save(actart);
  }
  //Delete a relation between an activity and an artwork;
  deleteRelation(idActivity: number, idArtwork: number){
    return this._activityArtworkRepository.createQueryBuilder("activity_artwork").
    delete().where("activityIdActivity = :idActivity AND artworkIdArtwork= :idArtwork",{idActivity: idActivity, idArtwork: idArtwork}).
    execute();
  }
}