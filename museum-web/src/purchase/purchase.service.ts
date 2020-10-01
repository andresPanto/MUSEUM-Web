import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';

@Injectable()
export class PurchaseService {
  constructor(@InjectRepository(PurchaseEntity) private readonly _purchaseRepository: Repository<PurchaseEntity>) {
  }

  savePurchase(newPurchase: PurchaseEntity){
    return this._purchaseRepository.save(newPurchase);  
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
  //Get all the purchases from a given user
  getUserPurchases(user: UserEntity){
    const query: FindManyOptions<PurchaseEntity> = {
      where:[
        {
          user: user
          }
        ]
    } 
    return this._purchaseRepository.find(query);
  }
  //Get all purchases and its schedule from a given user;
  getUserPurchasesWithSchedule(user: UserEntity){
  
      return this._purchaseRepository.createQueryBuilder("purchase").
      leftJoinAndSelect("purchase.schedule","schedule").
      where("purchase.userIdUser = :id",{id: user.idUser}).
      getMany();
    
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