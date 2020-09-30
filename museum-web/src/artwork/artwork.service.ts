import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
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


}