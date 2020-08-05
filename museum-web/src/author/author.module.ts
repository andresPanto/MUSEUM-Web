import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        AuthorEntity
        ],
      'default'
    )
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]
})
export class AuthorModule {}
