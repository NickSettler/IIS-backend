import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherRequirement } from '../db/entities/teacher_requirement.entity';
import { CaslModule } from '../casl/casl.module';
import { TeacherRequirementsService } from './teacher_requirements.service';
import { TeacherRequirementsController } from './teacher_requirements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherRequirement]), CaslModule],
  providers: [TeacherRequirementsService],
  controllers: [TeacherRequirementsController],
})
export class TeacherRequirementsModule {}
