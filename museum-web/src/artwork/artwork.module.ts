import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkEntity])],
    controllers: [ArtworkController],
    providers: [ArtworkService],
    exports: [ArtworkService],
})
export class ArtworkModule {}