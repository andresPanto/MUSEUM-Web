import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './author.entity';
import { ArtworkAuthorModule } from 'src/artwork-author/artwork-author.module';
import { ArtworkModule } from 'src/artwork/artwork.module';
import { ActivityModule } from 'src/activity/activity.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [
        AuthorEntity
        ],
      'default'
    ),
    ArtworkAuthorModule,
    ArtworkModule,
    ActivityModule
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]
})
export class AuthorModule {}
