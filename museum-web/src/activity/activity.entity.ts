import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index([
  'type',
  'name'
])

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn({
    name: 'id_activity',
    unsigned: true,
  })
  idActivity: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: '256',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: '11',
    nullable: false,
  })
  type: string;

  @Column({
    name: 'location',
    type: 'varchar',
    length: '1000',
    nullable: false,
  })
  location: string;

  @Column({
    name: 'initial_date',
    type: 'date',
    nullable: false,
  })
  initialDate: Date;

  @Column({
    name: 'final_date',
    type: 'date',
    nullable: false,
  })
  finalDate: Date;

  @Column({
    name: 'description',
    type: 'varchar',
    length: '1000',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'duration',
    type: 'varchar',
    length: '10',
    nullable: false,
  })
  duration: string;

  @Column({
    name: 'pm_name',
    type: 'varchar',
    length: '256',
    nullable: false,
  })
  pmName: string;

  @Column({
    name: 'pm_phone_number',
    type: 'varchar',
    length: '15',
    nullable: false,
  })
  pmPhoneNumber: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

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
  status: boolean = true
}