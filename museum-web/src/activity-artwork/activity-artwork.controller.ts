import { Controller } from '@nestjs/common';
import { ActivityArtworkService } from './activity-artwork.service';

@Controller('activity-artworks')
export class ActivityArtworkController {
  constructor(private readonly _activityArtworkService: ActivityArtworkService) {
  }

}