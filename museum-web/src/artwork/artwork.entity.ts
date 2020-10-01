import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityArtworkEntity } from '../activity-artwork/activity-artwork.entity';
import { ArtworkAuthorEntity } from '../artwork-author/artwork-author.entity';

@Index([
  'name'
])

@Entity('artwork')
export class ArtworkEntity {
  @PrimaryGeneratedColumn({
    name: 'id_artwork',
    unsigned: true
  })
  idArtwork: number;
  
  @Column({
      name: 'name',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    name: string;
  
  @Column({
    name: 'year',
    type: 'varchar',
    length: '256',
    nullable: false
  })
  year: string;
  
  @Column({
      name: 'type',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    type: string;
  
  @Column({
      name: 'description',
      type: 'text',
      nullable: false
    })
    description: string;
  
  @Column({
      name: 'img_path',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    imagePath: string;

  @Column({
    name: 'status',
    type: 'boolean',
    nullable: false,
    default: true
  })
  status: boolean

  @OneToMany(
    type => ActivityArtworkEntity,
    activityArtwork => activityArtwork.artwork
  )
  activityArtworks: ActivityArtworkEntity[];

  @OneToMany(
    type => ArtworkAuthorEntity,
    artworkAuthor => artworkAuthor.artwork
  )
  artworkAuthors: ArtworkAuthorEntity[];



}