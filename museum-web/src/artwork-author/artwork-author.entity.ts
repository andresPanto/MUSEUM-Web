import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { AuthorEntity } from '../author/author.entity';

@Entity('artwork_author')
export class ArtworkAuthorEntity {
  @PrimaryGeneratedColumn({
    name: 'id_artwork_author',
    unsigned: true
  })
  idArtworkAuthor: number;

  @ManyToOne(
    type => ArtworkEntity,
    artwork => artwork.artworkAuthors
  )
  artwork: ArtworkEntity;

  @ManyToOne(
    type => AuthorEntity,
    author => author.artworkAuthors
  )
  author: AuthorEntity;

}