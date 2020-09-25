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

  async findAll(){
    const purchases = await this._purchaseRepository.find();
    console.log(purchases);
    return purchases
  }


}