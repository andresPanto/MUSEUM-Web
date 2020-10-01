import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkAuthorEntity } from './artwork-author.entity';
import { ArtworkAuthorsController } from './artwork-author.controller';
import { ArtworkAuthorService } from './artwork-author.service';
import { ArtworkModule } from 'src/artwork/artwork.module';
import { AuthorModule } from 'src/author/author.module';

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkAuthorEntity]), ArtworkModule, forwardRef(() => AuthorModule)],
    controllers: [ArtworkAuthorsController],
    providers: [ArtworkAuthorService],
    exports: [ArtworkAuthorService],
})
export class ArtworkAuthorModule {}