import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONSTANTS } from './enviroment/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';

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

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
