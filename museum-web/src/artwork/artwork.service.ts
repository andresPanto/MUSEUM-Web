import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,  FindManyOptions, In } from 'typeorm';
import { ArtworkEntity } from './artwork.entity';
import { AuthorEntity } from '../author/author.entity';

@Injectable()
export class ArtworkService {
  constructor(@InjectRepository(ArtworkEntity) private readonly artworkRepository: Repository<ArtworkEntity>) {
  }

  async create(artwork){
    const createdArtwork =  await this.artworkRepository.save(artwork);

    return  createdArtwork
  }

  async findAll(){
    const artworks = await this.artworkRepository.find();

    return artworks
  }

  async findOneByID(id:number){
    let findOptions: FindManyOptions<ArtworkEntity>;
    findOptions = {
      where: {
        idArtwork: id,
      },
    };
    const artworkFound =  await this.artworkRepository.findOne(findOptions);

    return  artworkFound
  }


  async  update(artwork: ArtworkEntity){
    const updatedArtwork =  await this.artworkRepository.save(artwork);

    return  updatedArtwork
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
  //Get all artworks stored in the database
  getAllArtworks(){
    return this.artworkRepository.find();
  }
  
}