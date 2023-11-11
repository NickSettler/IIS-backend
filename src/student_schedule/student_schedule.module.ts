import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSchedule } from '../db/entities/student_schedule.entity';
import { CaslModule } from '../casl/casl.module';
import { StudentScheduleService } from './student_schedule.service';
import { StudentScheduleController } from './student_schedule.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentSchedule]),
    CaslModule,
    UsersModule,
  ],
  providers: [StudentScheduleService],
  controllers: [StudentScheduleController],
})
export class StudentScheduleModule {}
