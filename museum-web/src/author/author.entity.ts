import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index([
  'fullName',
])


@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  idAuthor: number;

  @Column({
      name: 'full_name',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    fullName: string;

  @Column({
      name: 'country',
      type: 'varchar',
      length: '256',
      nullable: false
    })
    country: string;

    @Column({
        name: 'description',
        type: 'varchar',
        length: '1000',
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
    status: boolean = true

}