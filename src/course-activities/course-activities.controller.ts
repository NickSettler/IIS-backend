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
  UsePipes,
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
import { filter, pick, values } from 'lodash';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { permittedFieldsOf } from '@casl/ability/extra';

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

    return filter(await this.courseActivitiesService.findAll(), (activity) =>
      rules.can(E_ACTION.READ, activity),
    );
  }

  /**
   * Find all activities for a course
   */
  @Get('/:id/activities')
  @UseGuards(JwtAuthGuard)
  public async getAllForCourse(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, CourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read course activities",
      );

    return filter(
      await this.courseActivitiesService.findAll({
        where: {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: { id },
        },
      }),
      (course_activity) => rules.can(E_ACTION.READ, course_activity),
    );
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

    const foundActivity = await this.courseActivitiesService.findOne({
      where: {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundActivity)
      throw new NotFoundException('Course activity not found');

    if (!rules.can(E_ACTION.READ, foundActivity))
      throw new ForbiddenException(
        "You don't have permission to read this course activity",
      );

    return foundActivity;
  }

  /**
   * Create a course activity
   * @param createDto course activity data
   * @param request
   */
  @Post('/activity')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
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

    const foundCourseActivity = await this.courseActivitiesService.findOne({
      where: {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
          createdCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
      },
    });

    if (!rules.can(E_ACTION.READ, foundCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read this course activity",
      );

    return foundCourseActivity;
  }

  /**
   * Update course activity
   * @param id course activity id
   * @param updateDto course activity data
   * @param request
   */
  @Put('/activity/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
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

    const foundCourseActivity = await this.courseActivitiesService.findOne({
      where: {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    if (!rules.can(E_ACTION.UPDATE, foundCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to update this course activity",
      );

    const updatableFields = permittedFieldsOf(
      rules,
      E_ACTION.UPDATE,
      CourseActivity,
      {
        fieldsFrom: (rule) =>
          rule.fields || values(E_COURSE_ACTIVITY_ENTITY_KEYS),
      },
    );

    const updatedCourseActivity = await this.courseActivitiesService
      .update(id, pick(updateDto, updatableFields))
      .catch((err) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new NotFoundException('Course activity already exists');
        else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException("Can't update course activity");
      });

    const foundUpdatedCourseActivity =
      await this.courseActivitiesService.findOne({
        where: {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
            updatedCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
        },
      });

    if (!rules.can(E_ACTION.READ, foundUpdatedCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to read this course activity",
      );

    return foundUpdatedCourseActivity;
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

    const foundCourseActivity = await this.courseActivitiesService.findOne({
      where: {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundCourseActivity)
      throw new NotFoundException('Course activity not found');

    if (!rules.can(E_ACTION.DELETE, foundCourseActivity))
      throw new ForbiddenException(
        "You don't have permission to delete this course activity",
      );

    await this.courseActivitiesService.delete(id);
  }
}
