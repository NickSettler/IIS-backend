import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
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
import { handleCustomError, isCustomError, isError } from '../utils/errors';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Request } from 'express';
import { User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { filter } from 'lodash';

@Controller('courses')
export class CourseActivitiesController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly courseActivitiesService: CourseActivitiesService,
  ) {}

  /**
   * Find all course activities
   **/
  @Get('/activities')
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request): Promise<Array<CourseActivity>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read course activities",
      );

    return this.courseActivitiesService.findAll();
  }

  /**
   * Find all activities for a course
   */
  @Get('/:abbr/activities')
  @UseGuards(JwtAuthGuard)
  public async getAllForCourse(
    @Param('abbr') abbr: string,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read course activities",
      );

    const foundCourse = filter(
      await this.courseActivitiesService.findByOptions({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: { abbr },
      }),
      (course_activity) => rules.can(E_ACTION.READ, course_activity),
    );

    if (!foundCourse) throw new NotFoundException('Course not found');

    return foundCourse;
  }

  /**
   * Find one course activity by id
   * @param id course activity id
   * @param request
   */
  @Get('/activity/:id')
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('id') id: string, @Req() request: Request) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read course activities",
      );

    return this.courseActivitiesService.findByOptions({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
    });
  }

  /**
   * Create a course activity
   * @param createDto course activity data
   * @param request
   */
  @Post('/activity')
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() createDto: CreateCourseActivitiesDto,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to create course activity",
      );

    const createdCourseActivity = await this.courseActivitiesService
      .create(createDto)
      .catch((err) => {
        if (isError(err, 'FOREIGN_KEY_VIOLATION'))
          throw new UnprocessableEntityException('Course does not exist');
        else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException("Can't create course activity");
      });

    if (!rules.can(E_ACTION.READ, createdCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read this course activity",
      );

    return createdCourseActivity;
  }

  /**
   * Update course activity
   * @param id course activity id
   * @param updateDto course activity data
   * @param request
   */
  @Put('/activity/:id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseActivitiesDto,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to update course activity",
      );

    const foundCourseActivity =
      await this.courseActivitiesService.findByOptions({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    if (!rules.can(E_ACTION.UPDATE, foundCourseActivity[0]))
      throw new ForbiddenException(
        "You don't have permission to update this course activity",
      );

    const updatedCourseActivity = await this.courseActivitiesService
      .update(id, updateDto)
      .catch((err) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new NotFoundException('Course activity already exists');
        else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException("Can't update course activity");
      });

    if (!rules.can(E_ACTION.READ, updatedCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read this course activity",
      );

    return updatedCourseActivity;
  }

  /**
   * Delete course activity
   * @param id
   * @param request
   */
  @Delete('/activity/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id') id: string, @Req() request: Request) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to delete course activity",
      );

    const foundCourseActivity =
      await this.courseActivitiesService.findByOptions({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    if (!rules.can(E_ACTION.DELETE, foundCourseActivity[0]))
      throw new ForbiddenException(
        "You don't have permission to delete this course activity",
      );

    await this.courseActivitiesService.delete(id);
  }
}
