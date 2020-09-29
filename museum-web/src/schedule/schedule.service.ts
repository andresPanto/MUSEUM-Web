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
  getSchedule(idSchedule: number){
    //Get a certain schedule with an specified id.
    return this.scheduleRepository.findOne(idSchedule);
  }
  updateSchedule(schedule: ScheduleEntity){
    return this.scheduleRepository.save(schedule);
  }
  //Get an schedule and its activity
  getScheduleWithActivity(schedule: ScheduleEntity){
    return this.scheduleRepository.createQueryBuilder("schedule").
      leftJoinAndSelect("schedule.activity","activity").
      where("schedule.id_schedule = :id",{id: schedule.idSchedule}).
      getOne();
  }
}