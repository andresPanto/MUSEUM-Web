import { AuthorEntity } from '../author/author.entity';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { RoleEntity } from '../role/role.entity';
import { UserEntity } from '../user/user.entity';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';

export const ENTITIES = [
  ActivityEntity,
  AuthorEntity,
  ArtworkEntity,
  PurchaseEntity,
  RoleEntity,
  ScheduleEntity,
  UserEntity,
  UserRoleEntity,
];