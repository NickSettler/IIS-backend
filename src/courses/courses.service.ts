import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../db/entities/course.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { isError } from '../utils/errors';

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
}
