import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArtworkAuthorEntity } from '../artwork-author/artwork-author.entity';

@Index([
  'fullName',
])


@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn({
    name: 'id_author',
    unsigned: true,
  })
  idAuthor: number;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: '256',
    nullable: false,
  })
  fullName: string;

  @Column({
    name: 'country',
    type: 'varchar',
    length: '256',
    nullable: false,
  })
  country: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
  })
  description: string;
  @Column({
    name: 'img_path',
    type: 'varchar',
    length: '256',
    nullable: false,
  })
  imagePath: string;

  @Column({
    name: 'status',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  status: boolean = true;


  @OneToMany(
    type => ArtworkAuthorEntity,
    artworkAuthor => artworkAuthor.author,
  )
  artworkAuthors: ArtworkAuthorEntity[];

}