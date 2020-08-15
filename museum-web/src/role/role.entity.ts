import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEntity } from '../user-role/user-role.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn({
    name: 'id_role',
    unsigned: true,
  })
  idRole: number;

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: '10',
    nullable: false,
  })
  roleName: string;


  @OneToMany(
    type => UserRoleEntity,
    userRole => userRole.role,
  )
  userRoles: UserRoleEntity[];

}