import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { isError } from '../utils/errors';
import { CreateCoursesDto, UpdateCourseDto } from './courses.dto';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { assign, isArray, map, omitBy } from 'lodash';

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
    // check if guarantor_id exists in users table
    const course = this.coursesRepository.create({
      ...createDto,
      ...(createDto[E_COURSE_ENTITY_KEYS.GUARANTOR] && {
        [E_COURSE_ENTITY_KEYS.GUARANTOR]: {
          [E_USER_ENTITY_KEYS.ID]: createDto[E_COURSE_ENTITY_KEYS.GUARANTOR],
        },
      }),
      ...(createDto[E_COURSE_ENTITY_KEYS.TEACHERS] && {
        [E_COURSE_ENTITY_KEYS.TEACHERS]: map(
          createDto[E_COURSE_ENTITY_KEYS.TEACHERS],
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
   * @param abbr course abbreviation
   * @param updateDto course data
   */
  public async update(
    abbr: string,
    updateDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!course) throw new ConflictException('Course not found');

    assign(course, omitBy(updateDto, isArray));

    // check if new guarantor_id exists in users table
    await this.coursesRepository.save({
      ...course,
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
      where: { [E_COURSE_ENTITY_KEYS.ABBR]: abbr },
    });
  }

  /**
   * Delete a course
   * @param abbr course abbreviation
   */
  public async delete(abbr: string): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!course) throw new NotFoundException('Course not found');

    await this.coursesRepository.delete(abbr);
  }
}
