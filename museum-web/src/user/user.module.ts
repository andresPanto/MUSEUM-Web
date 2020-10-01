import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, UserRoleModule, RoleModule, AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}