import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { isError } from '../utils/errors';
import { UpdateCoursesDto } from './courses.dto';

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

  public async create(createDto: Course): Promise<Course> {
    const course = this.coursesRepository.create(createDto);

    await this.coursesRepository.save(course).catch((err: any) => {
      if (isError(err, 'UNIQUE_CONSTRAINT')) {
        throw new ConflictException('Course already exists');
      }
      throw err;
    });
    return this.coursesRepository.save(course);
  }

  /**
   * Update a course
   * @param abbr course abbreviation
   * @param updateDto course data
   */
  public async update(
    abbr: string,
    updateDto: UpdateCoursesDto,
  ): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ABBR]: abbr },
    });
    if (!course) throw new ConflictException('Course not found');

    const updatedCourse = this.coursesRepository.merge(course, updateDto);

    return await this.coursesRepository.save(updatedCourse);
  }

  /**
   * Delete a course
   * @param abbr course abbreviation
   */
  public async delete(abbr: string): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { [E_COURSE_ENTITY_KEYS.ABBR]: abbr },
    });
    if (!course) throw new NotFoundException('User not found');

    await this.coursesRepository.delete(abbr);
  }
}
