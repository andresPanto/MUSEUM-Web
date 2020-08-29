import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkAuthorEntity } from './artwork-author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtworkAuthorService {
  constructor(@InjectRepository(ArtworkAuthorEntity) private readonly _artworkAuthorRepository: Repository<ArtworkAuthorEntity>) {
  }

}