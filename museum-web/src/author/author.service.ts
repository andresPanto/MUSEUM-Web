import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions } from 'typeorm';
import { AuthorEntity } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>
  ) {}

  // async insertar(newAuthor: object){
  //   try{
  //     const createdAuthor = await this.authorRepository.create(newAuthor);
  //     const savedAuthor = await this.authorRepository.save(createdAuthor);
  //     return  savedAuthor
  //   }catch (e) {
  //
  //   }
  //}

  //Obtain all authors from a given array of ids
  getAuthors(ids: String[]){
    const query: FindManyOptions<AuthorEntity> = {
      where:[
        {
          idAuthor:In(ids)
          }
        ]
    } 
    return this.authorRepository.find(query);
  }
  //Get all authors stored in the database
  getAllAuthors(){
    return this.authorRepository.find();
  }
  getAuthor(idAuthor: number){
    return this.authorRepository.findOne(idAuthor);
  }
}
