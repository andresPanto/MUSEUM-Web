import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity{
  @PrimaryGeneratedColumn({
    name: 'id_user',
    unsigned: false
  })
  idUser: number

  @Column({
      name: 'username',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    username: string;
  
  @Column({
      name: 'password',
      type: 'varchar',
      length: '32',
      nullable: false
    })
    password: string;
  
  @Column({
      name: 'email',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    email: string;

@Column({
    name: 'full_name',
    type: 'varchar',
    length: '256',
    nullable: false
  })
  fullName: string;

  @Column({
      name: 'phone_number',
      type: 'varchar',
      length: '15',
      nullable: false
    })
    phoneNumber: string;
  
  @Column({
      name: 'img_path',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    imagePath: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
    nullable: false
  })
  status: boolean

}