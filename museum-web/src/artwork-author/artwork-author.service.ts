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
  //Get all the authors (entities) from a given artwork;
  getArtworkAndAuthors(idArtwork: number){
    return this._artworkAuthorRepository.createQueryBuilder("artwork_author").
    leftJoinAndSelect("artwork_author.author", "author").
    where("artworkIdArtwork = :id", {id: idArtwork}).
    getMany();
  }
  //Delete a relation between an artwork and an author;
  deleteRelation(idArtwork: number, idAuthor: number){
    return this._artworkAuthorRepository.createQueryBuilder("artwork_author").
    delete().where("artworkIdArtwork = :idArtwork AND authorIdAuthor= :idAuthor",{idArtwork: idArtwork, idAuthor: idAuthor}).
    execute();
  }
  //Save a new relation between artwork and author.
  saveRelation(artauth: ArtworkAuthorEntity){
    return this._artworkAuthorRepository.save(artauth);
  }
}