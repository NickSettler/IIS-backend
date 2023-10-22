import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CourseActivity,
  E_COURSE_ACTIVITY_ENTITY_KEYS,
} from '../db/entities/course_activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  CreateCourseActivitiesDto,
  UpdateCourseActivitiesDto,
} from './course-activities.dto';
import { E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';

@Injectable()
export class CourseActivitiesService {
  constructor(
    @InjectRepository(CourseActivity)
    private courseActivitiesRepository: Repository<CourseActivity>,
  ) {}

  /**
   * Find all course activities
   */
  public async findAll(): Promise<Array<CourseActivity>> {
    return this.courseActivitiesRepository.find({
      relations: [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE],
    });
  }

  /**
   * Find all activities for a course
   * @param options find options
   */
  public async findByOptions(
    options: FindOptionsWhere<CourseActivity>,
  ): Promise<Array<CourseActivity>> {
    return this.courseActivitiesRepository.findBy(options);
  }

  /**
   * Find one activity using options
   * @param options
   */
  public async findOne(options: FindOneOptions<CourseActivity>) {
    return this.courseActivitiesRepository.findOne(options);
  }

  /**
   * Create a course activity
   * @param createDto course activity data
   */
  public async create(
    createDto: CreateCourseActivitiesDto,
  ): Promise<CourseActivity> {
    const newCourseActivity = this.courseActivitiesRepository.create({
      ...createDto,
      ...(createDto[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE] && {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: {
          [E_COURSE_ENTITY_KEYS.ABBR]:
            createDto[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE],
        },
      }),
    });

    return await this.courseActivitiesRepository.save(newCourseActivity);
  }

  /**
   * Update a course activity
   */
  public async update(
    id: string,
    updateDto: UpdateCourseActivitiesDto,
  ): Promise<CourseActivity> {
    const courseActivityToUpdate =
      await this.courseActivitiesRepository.findOne({
        where: { [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id },
      });

    if (!courseActivityToUpdate)
      throw new ConflictException('Course activity not found');

    const updatedCourseActivity = this.courseActivitiesRepository.merge(
      courseActivityToUpdate,
      {
        ...updateDto,
        ...(updateDto[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE] && {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: {
            [E_COURSE_ENTITY_KEYS.ABBR]:
              updateDto[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE],
          },
        }),
      },
    );

    return await this.courseActivitiesRepository.save(updatedCourseActivity);
  }

  /**
   * Delete a course activity
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const deletedCourseActivity = await this.courseActivitiesRepository.findOne(
      {
        where: { [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id },
      },
    );

    if (!deletedCourseActivity)
      throw new NotFoundException('Course activity not found');

    await this.courseActivitiesRepository.delete(id);
  }
}