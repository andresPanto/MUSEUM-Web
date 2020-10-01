import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONSTANTS } from './enviroment/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { ArtworkModule } from './artwork/artwork.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ActivityModule } from './activity/activity.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ActivityArtworkModule } from './activity-artwork/activity-artwork.module';
import { ArtworkAuthorModule } from './artwork-author/artwork-author.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: CONSTANTS.DB.name,
      type: "mysql",
      host: CONSTANTS.DB.host,
      port: CONSTANTS.DB.port,
      username: CONSTANTS.DB.username,
      password: CONSTANTS.DB.password,
      database: CONSTANTS.DB.database,
      entities: CONSTANTS.DB.entities,
      synchronize: CONSTANTS.DB.synchronize,
      dropSchema: CONSTANTS.DB.dropSchema,
    }),
    AuthorModule,
    ArtworkModule,
    RoleModule,
    UserModule,
    PurchaseModule,
    ScheduleModule,
    ActivityModule,
    ArtworkAuthorModule,
    AuthModule,
    //UserRoleModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
