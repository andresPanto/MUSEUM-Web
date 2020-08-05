import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index([
  'name'
])

@Entity('artwork')
export class ArtworkEntity {
  @PrimaryGeneratedColumn({
    name: 'id_artwork',
    unsigned: true
  })
  idAuthor: number;
  
  @Column({
      name: 'name',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    name: string;
  
  @Column({
    name: 'year',
    type: 'int',
    nullable: false
  })
  year: number;
  
  @Column({
      name: 'type',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    type: string;
  
  @Column({
      name: 'description',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    description: string;
  
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
    nullable: false,
    default: true
  })
  status: boolean
  
}