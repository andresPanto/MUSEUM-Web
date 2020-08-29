import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityArtworkEntity } from './activity-artwork.entity';
import { ActivityArtworkController } from './activity-artwork.controller';
import { ActivityArtworkService } from './activity-artwork.service';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityArtworkEntity])],
    controllers: [ActivityArtworkController],
    providers: [ActivityArtworkService],
    exports: [ActivityArtworkService],
})
export class ActivityArtworkModule {}