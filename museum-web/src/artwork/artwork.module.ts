import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { ActivityArtworkModule } from 'src/activity-artwork/activity-artwork.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkEntity]), ActivityArtworkModule, ActivityModule],
    controllers: [ArtworkController],
    providers: [ArtworkService],
    exports: [ArtworkService],
})
export class ArtworkModule {}