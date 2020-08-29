import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkAuthorEntity } from './artwork-author.entity';
import { ArtworkAuthorsController } from './artwork-author.controller';
import { ArtworkAuthorService } from './artwork-author.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkAuthorEntity])],
    controllers: [ArtworkAuthorsController],
    providers: [ArtworkAuthorService],
    exports: [ArtworkAuthorService],
})
export class ArtworkAuthorModule {}