import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleEntity } from './schedule.entity';
import { FindManyOptions,Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>) {
  }
  getScheduleActivity(idActivity: number){
    //Get all schedules from a given activity
    return this.scheduleRepository.createQueryBuilder("schedule").
    leftJoin("schedule.activity","activity").
    where("activity.id_activity = :id",{id: idActivity}).
    getMany();
  }

}