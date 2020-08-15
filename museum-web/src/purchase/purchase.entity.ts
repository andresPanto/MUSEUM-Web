import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  purchaseTime: Date;

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



}