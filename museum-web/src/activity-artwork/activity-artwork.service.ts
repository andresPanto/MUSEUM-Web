import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}