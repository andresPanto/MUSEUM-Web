import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleEntity } from './schedule.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { AuthorEntity } from '../author/author.entity';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>) {
  }

  async findAllByActivity(idActivity: number){
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.activity', 'activity')
      .where('activity.idActivity = :idActivity', {  idActivity })
      .getMany();
    console.log(schedules);
    return schedules;
  }

  async findOneByID(id:number){

    let findOptions: FindManyOptions<ScheduleEntity>;
    findOptions = {
      relations: ['activity'],
      where: {
        idSchedule: id,
      },
    };
    const scheduleFound =  await this.scheduleRepository.findOne(findOptions);
    console.log(scheduleFound);
    return  scheduleFound
  }

  async  update(author: ScheduleEntity){
    const updatedSchedule =  await this.scheduleRepository.save(author);
    console.log(updatedSchedule);
    return  updatedSchedule
  }

  async create(schedule){
    const createdSchedule =  await this.scheduleRepository.save(schedule);
    console.log(createdSchedule);
    return  createdSchedule
  }


}