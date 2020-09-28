import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { ScheduleEntity } from '../schedule/schedule.entity';

@Injectable()
export class PurchaseService {
  constructor(@InjectRepository(PurchaseEntity) private readonly _purchaseRepository: Repository<PurchaseEntity>) {
  }

  async create(newPurchase){
    const purchaseSaved = await this._purchaseRepository.save(newPurchase);
    return purchaseSaved
  }

  async findAll(){
    const findOptions: FindManyOptions<PurchaseEntity> = {
      relations: ['schedule', 'schedule.activity', 'user']
    }
    const purchases = await this._purchaseRepository.find(findOptions);
    console.log(purchases);
    return purchases
  }

  async findOneByID(id:number){

    let findOptions: FindManyOptions<PurchaseEntity>;
    findOptions = {
      where: {
        idPurchase: id,
      },
    };
    const purchase =  await this._purchaseRepository.findOne(findOptions);
    console.log(purchase);
    return  purchase
  }

  async  update(purchase: PurchaseEntity){
    const updatedPurchase =  await this._purchaseRepository.save(purchase);
    console.log(updatedPurchase);
    return  updatedPurchase
  }


}