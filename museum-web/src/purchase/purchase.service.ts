import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseService {
  constructor(@InjectRepository(PurchaseEntity) private readonly _purchaseRepository: Repository<PurchaseEntity>) {
  }

  async create(newPurchase){
    const purchaseSaved = await this._purchaseRepository.save(newPurchase);
    return purchaseSaved
  }
  getSchedulePurhcases(idSchedule: number){
    //Get all purchases from a given schedule
    //Agrupar por idSchedule los sum(quantities)
    return this._purchaseRepository.createQueryBuilder("purchase").
    leftJoin("purchase.schedule","schedule").
    where("activity.id_activity = :id",{id: idSchedule}).
    getMany();
  }

}