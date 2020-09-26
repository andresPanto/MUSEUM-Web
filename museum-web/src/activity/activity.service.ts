import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './activity.entity';
import { FindManyOptions, In, Repository } from 'typeorm';

@Injectable()

export class ActivityService {
  constructor(
    @InjectRepository(ActivityEntity) private readonly activityRepository: Repository<ActivityEntity>
  ){}
  //Obtain all activities from a given category
  getCategoryActivities(type: String){
    const query: FindManyOptions<ActivityEntity> ={
      where:{
        type:type
      }
    }
    return this.activityRepository.find(query);
  }
  //Obtain all activities from a given array of ids
  getActivities(ids: String[]){
    const query: FindManyOptions<ActivityEntity> = {
      where:[
        {
              idActivity:In(ids)
          }
        ]
      
    } 
    return this.activityRepository.find(query); //Devuelve una promesa
  }
   
}