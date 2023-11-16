import { Module } from '@nestjs/common';
import { CourseStudentsController } from './course-students.controller';
import { CourseStudentsService } from './course-students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { CourseStudent } from '../db/entities/course_students.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseStudent]), CaslModule],
  controllers: [CourseStudentsController],
  providers: [CourseStudentsService],
})
export class CourseStudentsModule {}
