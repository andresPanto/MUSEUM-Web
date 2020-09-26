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
  getSchedulePurchases(idSchedule: number){
    //Get all purchases from a given schedule
    //Agrupar por idSchedule los sum(quantities)
    //select sum(quantity) from purchase where scheduleIdSchedule=3 group by scheduleIdSchedule;
    return this._purchaseRepository.createQueryBuilder("purchase").
    select("SUM(purchase.quantity)").
    leftJoin("purchase.schedule","schedule").
    where("schedule.id_schedule = :id",{id: idSchedule}).
    groupBy("id_schedule").
    getRawOne();
  }

}