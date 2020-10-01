import { AuthorEntity } from '../author/author.entity';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { RoleEntity } from '../role/role.entity';
import { UserEntity } from '../user/user.entity';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { ActivityArtworkEntity } from '../activity-artwork/activity-artwork.entity';
import { ArtworkAuthorEntity } from '../artwork-author/artwork-author.entity';

export const ENTITIES = [
  ActivityArtworkEntity,
  ActivityEntity,
  ArtworkEntity,
  ArtworkAuthorEntity,
  AuthorEntity,
  PurchaseEntity,
  RoleEntity,
  ScheduleEntity,
  UserEntity,
  UserRoleEntity,
];