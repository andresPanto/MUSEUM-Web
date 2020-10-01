import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';
import { ActivityArtworkController } from './activity-artwork.controller';
import { ActivityArtworkService } from './activity-artwork.service';
import { ActivityModule } from 'src/activity/activity.module';
import { ArtworkModule } from 'src/artwork/artwork.module';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityArtworkEntity]), ActivityModule, forwardRef(() => ArtworkModule)],
    controllers: [ActivityArtworkController],
    providers: [ActivityArtworkService],
    exports: [ActivityArtworkService],
})
export class ActivityArtworkModule {}