import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtworkEntity } from './artwork.entity';

@Injectable()
export class ArtworkService {
  constructor(@InjectRepository(ArtworkEntity) private readonly artworkRepository: Repository<ArtworkEntity>) {
  }

  async create(artworkToCreate: object) {
    try {
      const artworkToSave = await this.artworkRepository.create(artworkToCreate);
      return await this.artworkRepository.save(artworkToSave);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}