import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  E_STUDENT_SCHEDULE_ENTITY_KEYS,
  StudentSchedule,
} from '../db/entities/student_schedule.entity';
import { Repository } from 'typeorm';
import { CreateStudentScheduleDto } from './student_schedule.dto';

@Injectable()
export class StudentScheduleService {
  constructor(
    @InjectRepository(StudentSchedule)
    private studentScheduleRepository: Repository<StudentSchedule>,
  ) {}

  /**
   * Find all studentSchedules with studentId
   * @param studentId
   */
  public async findAllForStudent(studentId: string) {
    return this.studentScheduleRepository.find({
      where: {
        [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: studentId,
      },
    });
  }

  /**
   * Find all studentSchedules with scheduleId
   * @param scheduleId
   */
  public async findAllForSchedule(scheduleId: string) {
    return this.studentScheduleRepository.find({
      where: {
        [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: scheduleId,
      },
    });
  }

  public async findOne(studentId: string, scheduleId: string) {
    return this.studentScheduleRepository.findOne({
      where: {
        [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: studentId,
        [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: scheduleId,
      },
    });
  }

  public async create(
    createDto: CreateStudentScheduleDto,
  ): Promise<StudentSchedule> {
    const studentSchedule = this.studentScheduleRepository.create(createDto);

    return await this.studentScheduleRepository.save(studentSchedule);
  }

  public async delete(studentId: string, scheduleId: string) {
    const foundStudentSchedule = await this.findOne(studentId, scheduleId);
    if (!foundStudentSchedule) {
      throw new NotFoundException('Student schedule not found');
    }

    return await this.studentScheduleRepository.delete({
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: studentId,
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: scheduleId,
    });
  }
}
