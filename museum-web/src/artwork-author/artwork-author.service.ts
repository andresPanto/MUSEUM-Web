import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkAuthorEntity } from './artwork-author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtworkAuthorService {
  constructor(@InjectRepository(ArtworkAuthorEntity) private readonly _artworkAuthorRepository: Repository<ArtworkAuthorEntity>) {
  }
  //Obtain the id of  all of the authors of a given artwork
  getArtworkAuthors(idArtwork: number){
    return this._artworkAuthorRepository.createQueryBuilder("artwork_author").
    select("authorIdAuthor").
    where("artworkIdArtwork = :id",{id: idArtwork}).
    getRawMany();
  }
}