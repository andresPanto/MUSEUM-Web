import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './activity.entity';
import { FindManyOptions, In, Repository, Like } from 'typeorm';
import { AuthorEntity } from '../author/author.entity';

@Injectable()

export class ActivityService {
  constructor(
    @InjectRepository(ActivityEntity) private readonly activityRepository: Repository<ActivityEntity>
  ){}
  //Obtain all activities from a given category
  getCategoryActivities(type: String){
    const query: FindManyOptions<ActivityEntity> ={
      where:{
        type:type,
        status:true
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
  //Obtain a certain activity given an id
  getActivity(idActivity: number){
    return this.activityRepository.findOne(idActivity);
  }
   //Obtain all activities matching a certain name
   searchActivities(query: String, type: String){
    const search: FindManyOptions<ActivityEntity> ={
          where: [
            {
                name: Like(`%${query}%`),
                type: type
            }
        ]
    }
    return this.activityRepository.find(search);
   }

  async findAll(){
    const activities = await this.activityRepository.find();

    return activities
  }

  async findOneByID(id:number){

    let findOptions: FindManyOptions<ActivityEntity>;
    findOptions = {
      where: {
        idActivity: id,
      },
    };
    const activityFound =  await this.activityRepository.findOne(findOptions);
    console.log(activityFound);
    return  activityFound
  }

  async  update(activity: ActivityEntity){
    const updatedActivity =  await this.activityRepository.save(activity);
    console.log(updatedActivity);
    return  updatedActivity
  }

  async create(activity){
    const createdActivity =  await this.activityRepository.save(activity);
    console.log(createdActivity);
    return  createdActivity
  }

}