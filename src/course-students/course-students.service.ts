import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CourseStudent,
  E_COURSE_STUDENTS_ENTITY_KEYS,
} from '../db/entities/course_students.entity';
import { E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { CreateCourseStudentDto } from './course-students.dto';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';

@Injectable()
export class CourseStudentsService {
  constructor(
    @InjectRepository(CourseStudent)
    private courseStudentsRepository: Repository<CourseStudent>,
  ) {}

  public async findAll(): Promise<Array<CourseStudent>> {
    return this.courseStudentsRepository.find();
  }

  public async findOne(
    options: FindOneOptions<CourseStudent>,
  ): Promise<CourseStudent> {
    return this.courseStudentsRepository.findOne({
      ...options,
    });
  }

  public async create(
    createDto: CreateCourseStudentDto,
  ): Promise<CourseStudent> {
    const newCourseStudent = this.courseStudentsRepository.create({
      [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE]: {
        [E_COURSE_ENTITY_KEYS.ID]:
          createDto[E_COURSE_STUDENTS_ENTITY_KEYS.COURSE],
      },
      [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT]: {
        [E_USER_ENTITY_KEYS.ID]:
          createDto[E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT],
      },
    });

    return await this.courseStudentsRepository.save(newCourseStudent);
  }

  public async delete(courseID: string, studentID: string): Promise<void> {
    const deletedCourseStudent = await this.courseStudentsRepository.findOne({
      where: {
        [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID]: studentID,
        [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID]: courseID,
      },
    });

    if (!deletedCourseStudent)
      throw new NotFoundException('Course student not found');

    await this.courseStudentsRepository.delete({
      [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID]: studentID,
      [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID]: courseID,
    });
  }
}
