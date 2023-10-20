import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseActivitiesService } from './course-activities.service';
import {
  CourseActivity,
  E_COURSE_ACTIVITY_ENTITY_KEYS,
} from '../db/entities/course_activity.entity';
import {
  CreateCourseActivitiesDto,
  UpdateCourseActivitiesDto,
} from './course-activities.dto';
import { isError } from '../utils/errors';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('courses')
export class CourseActivitiesController {
  constructor(
    private readonly courseActivitiesService: CourseActivitiesService,
  ) {}

  /**
   * Find all course activities
   **/
  @Get('/activities')
  public async getAll(): Promise<Array<CourseActivity>> {
    return this.courseActivitiesService.findAll();
  }

  /**
   * Find all activities for a course
   */
  @Get('/:abbr/activities')
  public async getAllForCourse(@Param('abbr') abbr: string) {
    const foundCourse = this.courseActivitiesService.findByOptions({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: { abbr },
    });

    if (!foundCourse) throw new NotFoundException('Course not found');

    return foundCourse;
  }

  /**
   * Find one course activity by id
   * @param id course activity id
   */
  @Get('/activity/:id')
  public async getOne(@Param('id') id: string) {
    return this.courseActivitiesService.findByOptions({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
    });
  }

  /**
   * Create a course activity
   * @param createDto course activity data
   */
  @Post('/activity')
  public async create(@Body() createDto: CreateCourseActivitiesDto) {
    return this.courseActivitiesService.create(createDto).catch((err) => {
      if (isError(err, 'UNIQUE_CONSTRAINT'))
        throw new NotFoundException('Course activity already exists');
      else
        throw new InternalServerErrorException("Can't create course activity");
    });
  }

  /**
   * Update course activity
   * @param id course activity id
   * @param updateDto course activity data
   */
  @Put('/activity/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseActivitiesDto,
  ) {
    const foundCourseActivity =
      await this.courseActivitiesService.findByOptions({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    return await this.courseActivitiesService.update(id, updateDto);
  }

  @Delete('/activity/:id')
  public async delete(@Param('id') id: string) {
    const foundCourseActivity =
      await this.courseActivitiesService.findByOptions({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    await this.courseActivitiesService.delete(id);
  }
}
