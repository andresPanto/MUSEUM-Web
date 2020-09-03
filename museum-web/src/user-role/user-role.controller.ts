import { UserRoleService } from './user-role.service';
import { Controller } from '@nestjs/common';

@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly _userRoleService: UserRoleService) {
  }
}