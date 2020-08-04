import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn({
    name: 'id_role',
    unsigned: true
  })
  idRole: number;

  @Column({
      name: 'role_name',
      type: 'varchar',
      length: '10',
      nullable: false
    })
    roleName: string;

}