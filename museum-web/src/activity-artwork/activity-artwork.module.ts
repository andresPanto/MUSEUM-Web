import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';
import { ActivityArtworkController } from './activity-artwork.controller';
import { ActivityArtworkService } from './activity-artwork.service';
import { ArtworkEntity } from 'src/artwork/artwork.entity';
import { ActivityEntity } from 'src/activity/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityArtworkEntity])],
    controllers: [ActivityArtworkController],
    providers: [ActivityArtworkService],
    exports: [ActivityArtworkService],
})
export class ActivityArtworkModule {}