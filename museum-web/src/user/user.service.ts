import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {
  }

  async findUSerByCredentials(username: string, password: string) {
    let findOptions: FindManyOptions<UserEntity>;
    findOptions = {
      relations: ['userRoles', 'userRoles.role'],
      where: {
        username,
        password,
      },
    };
    const userFound =  await this._userRepository.findOne(findOptions);
    return userFound
  }

  async findAllUsers(){
    const users = await this._userRepository.find();
    console.log(users);
    return  users
  }

}