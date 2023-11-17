import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCoursesDto, UpdateCourseDto } from './courses.dto';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { assign, isArray, map, omitBy, without } from 'lodash';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  /**
   * Find all courses
   */
  public async findAll(): Promise<Array<Course>> {
    return this.coursesRepository.find();
  }

  /**
   * Find one course using options
   * @param options
   */
  public async findOne(options: FindOneOptions<Course>) {
    return this.coursesRepository.findOne(options);
  }

  /**
   * Create a course
   * @param createDto
   */
  public async create(createDto: CreateCoursesDto): Promise<Course> {
    const course = this.coursesRepository.create({
      ...createDto,
      ...(createDto[E_COURSE_ENTITY_KEYS.GUARANTOR] && {
        [E_COURSE_ENTITY_KEYS.GUARANTOR]: {
          [E_USER_ENTITY_KEYS.ID]: createDto[E_COURSE_ENTITY_KEYS.GUARANTOR],
        },
      }),
      ...(createDto[E_COURSE_ENTITY_KEYS.TEACHERS] && {
        [E_COURSE_ENTITY_KEYS.TEACHERS]: map(
          without(
            createDto[E_COURSE_ENTITY_KEYS.TEACHERS],
            createDto[E_COURSE_ENTITY_KEYS.GUARANTOR],
          ),
          (teacher) => ({
            [E_USER_ENTITY_KEYS.ID]: teacher,
          }),
        ),
      }),
    });

    return await this.coursesRepository.save(course);
  }

  /**
   * Update a course
   * @param id course abbreviation
   * @param updateDto course data
   */
  public async update(id: string, updateDto: UpdateCourseDto): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ID]: id },
    });

    if (!course) throw new ConflictException('Course not found');

    assign(course, omitBy(updateDto, isArray));

    // check if new guarantor_id exists in users table
    await this.coursesRepository.save({
      ...course,
      ...(updateDto[E_COURSE_ENTITY_KEYS.GUARANTOR] && {
        [E_COURSE_ENTITY_KEYS.GUARANTOR]: {
          [E_USER_ENTITY_KEYS.ID]: updateDto[E_COURSE_ENTITY_KEYS.GUARANTOR],
        },
      }),
      ...(updateDto[E_COURSE_ENTITY_KEYS.TEACHERS] && {
        [E_COURSE_ENTITY_KEYS.TEACHERS]: map(
          updateDto[E_COURSE_ENTITY_KEYS.TEACHERS],
          (teacher) => ({
            [E_USER_ENTITY_KEYS.ID]: teacher,
          }),
        ),
      }),
    });

    return await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ID]: id },
    });
  }

  /**
   * Delete a course
   * @param id course abbreviation
   */
  public async delete(id: string): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ID]: id },
    });

    if (!course) throw new NotFoundException('Course not found');

    await this.coursesRepository.delete(id);
  }
}
