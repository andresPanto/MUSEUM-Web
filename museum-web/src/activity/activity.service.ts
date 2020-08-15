import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './activity.entity';
import { Repository } from 'typeorm';

@Injectable()

export class ActivityService {
  constructor(
    @InjectRepository(ActivityEntity) private readonly activityRepository: Repository<ActivityEntity>
  ){}

}