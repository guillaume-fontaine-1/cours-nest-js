import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Report} from "./report.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
