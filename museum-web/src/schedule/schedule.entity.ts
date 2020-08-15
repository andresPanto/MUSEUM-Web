import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn({
    name: 'id_schedule',
    unsigned: true
  })
  idSchedule: number;
  @Column({
      name: 'schedule',
      type: 'varchar',
      length: '11',
      nullable: false
    })
    schedule: string;

  @Column({
    name: 'capacity',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  capacity: number;

  @Column({
    name: 'status',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  status: boolean

}