import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { AuthorEntity } from './author.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>
  ) {}

  async findAll(){
    const authors = await this.authorRepository.find();
    console.log('Service Authors', authors);
    return authors
  }

  async findOneByID(id:number){

    let findOptions: FindManyOptions<AuthorEntity>;
    findOptions = {
      where: {
        idAuthor: id,
      },
    };
    const userFound =  await this.authorRepository.findOne(findOptions);
    console.log(userFound);
    return  userFound
  }

  async  update(author: AuthorEntity){

    const updatedUser =  await this.authorRepository.save(author);
    console.log(updatedUser);
    return  updatedUser
  }

  async create(author){

    const createdUser =  await this.authorRepository.save(author);
    console.log(createdUser);
    return  createdUser
  }


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
