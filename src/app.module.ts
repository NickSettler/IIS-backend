import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './class/classes.module';
import { CoursesModule } from './courses/courses.module';
import { CaslModule } from './casl/casl.module';
import { CourseActivitiesModule } from './course-activities/course-activities.module';
import { TeacherRequirementsModule } from './teacher_requirements/teacher_requirements.module';
import { StudentScheduleModule } from './student_schedule/student_schedule.module';
import { CourseStudentsModule } from './course-students/course-students.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ServerModule } from './server/server.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      schema: 'public',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    CaslModule,
    UsersModule,
    AuthModule,
    CourseActivitiesModule,
    CoursesModule,
    ClassesModule,
    TeacherRequirementsModule,
    StudentScheduleModule,
    CourseStudentsModule,
    ScheduleModule,
    ServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
