import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleEntity) private readonly _roleRepository: Repository<RoleEntity>) {
  }
  getRole(roleName: String){
    const search: FindOneOptions<RoleEntity> ={
      where: [
        {
            roleName: roleName
      
        }
    ]
    }
    return this._roleRepository.findOne(search);
  }

}