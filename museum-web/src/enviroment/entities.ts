import { AuthorEntity } from '../author/author.entity';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { RoleEntity } from '../role/role.entity';
import { UserEntity } from '../user/user.entity';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';

export const ENTITIES = [
  AuthorEntity,
  ArtworkEntity,
  PurchaseEntity,
  RoleEntity,
  ScheduleEntity,
  UserEntity,
];