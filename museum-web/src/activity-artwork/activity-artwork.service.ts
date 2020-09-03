import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';

@Injectable()
export class ActivityArtworkService {
  constructor(@InjectRepository(ActivityArtworkEntity) private readonly _activityArtworkRepository: Repository<ActivityArtworkEntity>) {
  }


}