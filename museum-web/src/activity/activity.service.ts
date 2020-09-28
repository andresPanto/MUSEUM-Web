import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './activity.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { AuthorEntity } from '../author/author.entity';

@Injectable()

export class ActivityService {
  constructor(
    @InjectRepository(ActivityEntity) private readonly activityRepository: Repository<ActivityEntity>
  ){}

  async findAll(){
    const activities = await this.activityRepository.find();
    console.log('Service Authors', activities);
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