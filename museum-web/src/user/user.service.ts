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
    const userFound = await this._userRepository.findOne(findOptions);
    return userFound;
  }


  async findAllClients() {
    const users = await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('role.roleName = :client', { client: 'client' })
      .getMany();
    console.log(users);
    return users;
  }

  


  async findOneByID(id: number) {

    let findOptions: FindManyOptions<UserEntity>;
    findOptions = {
      where: {
        idUser: id,
      },
    };
    const userFound = await this._userRepository.findOne(findOptions);
    return userFound;
  }

  async update(user: UserEntity) {

    const updatedUser = await this._userRepository.save(user);
    console.log(updatedUser);
    return updatedUser;
  }

  getLastInsertedId(){
    return this._userRepository.createQueryBuilder("user").
    select("MAX(id_user)").
    getRawOne();
  }
  createUser(newUser: UserEntity){
    return this._userRepository.save(newUser);
  }

}