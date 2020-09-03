import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { ArtworkEntity } from '../artwork/artwork.entity';

@Entity('activity_artwork')
export class ActivityArtworkEntity {
  @PrimaryGeneratedColumn({
    name: 'id_activity_artwork',
    unsigned: true
  })
  idActivityArtwork;

  @ManyToOne(
    type => ActivityEntity,
    activity => activity.activityArtworks
  )
  activity: ActivityEntity

  @ManyToOne(
    type => ArtworkEntity,
    artwork => artwork.activityArtworks
  )
  artwork: ArtworkEntity

}