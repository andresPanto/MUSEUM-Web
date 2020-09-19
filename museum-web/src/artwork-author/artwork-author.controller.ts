import { Controller, Res, Get } from '@nestjs/common';
import { ArtworkAuthorService } from './artwork-author.service';

@Controller('artwork-authors')
export class ArtworkAuthorsController {
  constructor(private readonly _artworkAuthorsService: ArtworkAuthorService) {
  }
 
}