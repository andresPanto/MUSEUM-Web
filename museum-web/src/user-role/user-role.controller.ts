import { UserRoleService } from './user-role.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';


@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly _userRoleService: UserRoleService) {
  }
}