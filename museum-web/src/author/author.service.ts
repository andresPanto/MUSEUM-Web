import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

}
