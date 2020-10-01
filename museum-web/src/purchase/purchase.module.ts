import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { ActivityModule } from 'src/activity/activity.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([PurchaseEntity]), ActivityModule, ScheduleModule, UserModule, AuthModule],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService],
})
export class PurchaseModule {}
