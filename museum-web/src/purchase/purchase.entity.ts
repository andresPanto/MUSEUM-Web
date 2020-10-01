import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';

@Entity('purchase')
export class PurchaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id_purchase',
    unsigned: true
  })
  idPurchase: number;

  @Column({
    name: 'attendance_date',
    type: 'date',
    nullable: false
  })
  attendanceDate: Date;

  @Column({
    name: 'purchase_time',
    type: 'datetime',
    nullable: false
  })
  purchaseTime: String;

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
    unsigned: true
  })
  quantity: number;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  total: number;

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  status: boolean;

  @ManyToOne(
    type => UserEntity,
    user => user.purchases
  )
  user: UserEntity

  @ManyToOne(
    type => ScheduleEntity,
    schedule => schedule.purchases
  )
  schedule: ScheduleEntity



}