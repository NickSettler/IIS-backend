import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseActivity } from '../db/entities/course_activity.entity';
import { CourseActivitiesService } from './course-activities.service';
import { CourseActivitiesController } from './course-activities.controller';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseActivity]), CaslModule],
  providers: [CourseActivitiesService],
  controllers: [CourseActivitiesController],
})
export class CourseActivitiesModule {}
