import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({
    name: 'id_user_role',
    unsigned: true
  })
  idUserRole;

  @ManyToOne(
    type => UserEntity,
    user => user.userRoles
  )
  user: UserEntity

  @ManyToOne(
    type => RoleEntity,
    role => role.userRoles
  )
  role: RoleEntity
}