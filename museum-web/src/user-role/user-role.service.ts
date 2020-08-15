import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEntity } from './user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
  constructor(@InjectRepository(UserRoleEntity) private readonly _userRoleRepository: Repository<UserRoleEntity>) {
  }

  // async create(userRoleToCreate: object) {
  //   try {
  //     const userRoleToSave = await this._userRoleRepository.create(userRoleToCreate);
  //     return await this._userRoleRepository.save(userRoleToSave);
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(e);
  //   }
  // }
}