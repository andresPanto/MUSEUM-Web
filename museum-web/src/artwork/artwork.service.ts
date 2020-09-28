import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,  FindManyOptions, In } from 'typeorm';
import { ArtworkEntity } from './artwork.entity';

@Injectable()
export class ArtworkService {
  constructor(@InjectRepository(ArtworkEntity) private readonly artworkRepository: Repository<ArtworkEntity>) {
  }

  async create(artworkToCreate: object) {
    try {
      const artworkToSave = await this.artworkRepository.create(artworkToCreate);
      return await this.artworkRepository.save(artworkToSave);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
  }
  //Obtain all artworks from a given array of ids
  getArtworks(ids: String[]){
    const query: FindManyOptions<ArtworkEntity> = {
      where:[
        {
          idArtwork:In(ids)
          }
        ]
    } 
    return this.artworkRepository.find(query);
  }
  //Obtain a certain artwork given an id
  getArtwork(idArtwork: number){
    return this.artworkRepository.findOne(idArtwork);
  }
   
  
}