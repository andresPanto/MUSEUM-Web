import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { ActivityArtworkModule } from 'src/activity-artwork/activity-artwork.module';
import { ActivityModule } from 'src/activity/activity.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkEntity]), ActivityArtworkModule, ActivityModule, AuthModule],
    controllers: [ArtworkController],
    providers: [ArtworkService],
    exports: [ArtworkService],
})
export class ArtworkModule {}