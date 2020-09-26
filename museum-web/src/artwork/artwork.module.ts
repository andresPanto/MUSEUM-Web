import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
      AuthModule,
      TypeOrmModule.forFeature([ArtworkEntity])],
    controllers: [ArtworkController],
    providers: [ArtworkService],
    exports: [ArtworkService],
})
export class ArtworkModule {}