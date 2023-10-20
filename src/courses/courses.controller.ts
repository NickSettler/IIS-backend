import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import RolesGuard from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { E_ROLE } from '../db/entities/role.entity';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { CreateCoursesDto, UpdateCourseDto } from './courses.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { Request } from 'express';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { filter } from 'lodash';
import { isError } from '../utils/errors';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request): Promise<Array<Course>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, Course))
      throw new ForbiddenException("You don't have permission to read courses");

    const foundCourses = filter(await this.coursesService.findAll(), (course) =>
      rules.can(E_ACTION.READ, course),
    );

    if (!foundCourses.length) throw new NotFoundException('Courses not found');

    return foundCourses;
  }

  @Get('/:abbr')
  @UseGuards(JwtAuthGuard)
  public async getOne(
    @Req() request: Request,
    @Param('abbr') abbr: string,
  ): Promise<Course> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, Course))
      throw new ForbiddenException("You don't have permission to read courses");

    const foundCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
    });

    if (!foundCourse) throw new NotFoundException('Course not found');

    if (!rules.can(E_ACTION.READ, foundCourse))
      throw new ForbiddenException(
        "You don't have permission to read this class",
      );

    return foundCourse;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Req() request: Request,
    @Body() createDto: CreateCoursesDto,
  ): Promise<Course> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, Course))
      throw new ForbiddenException(
        "You don't have permission to create course",
      );

    const createdCourse = await this.coursesService
      .create(createDto)
      .catch((err: any) => {
        if (isError(err, 'UNIQUE_CONSTRAINT')) {
          throw new ConflictException('Course already exists');
        } else if (isError(err, 'FOREIGN_KEY_VIOLATION')) {
          if (err.constraint === 'fk_guarantor_id') {
            throw new UnprocessableEntityException('Guarantor does not exist');
          }
        }
        throw new InternalServerErrorException('Something went wrong');
      });

    if (!rules.can(E_ACTION.READ, createdCourse))
      throw new ForbiddenException(
        "You don't have permission to read this course",
      );

    return createdCourse;
  }

  @Put('/:abbr')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async update(
    @Req() request: Request,
    @Param('abbr') abbr: string,
    @Body() updateDto: UpdateCourseDto,
  ): Promise<Course> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, Course))
      throw new ForbiddenException(
        "You don't have permission to update course",
      );

    const foundCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
    });

    if (!foundCourse) throw new NotFoundException('Course not found');

    if (!rules.can(E_ACTION.UPDATE, foundCourse))
      throw new ForbiddenException(
        "You don't have permission to update this course",
      );

    const updatedCourse = await this.coursesService
      .update(abbr, updateDto)
      .catch((err: any) => {
        if (isError(err, 'FOREIGN_KEY_VIOLATION')) {
          if (err.constraint === 'fk_guarantor_id') {
            throw new UnprocessableEntityException('Guarantor does not exist');
          }
        }
        throw new InternalServerErrorException('Something went wrong');
      });

    if (!rules.can(E_ACTION.READ, updatedCourse))
      throw new ForbiddenException(
        "You don't have permission to read this course",
      );

    return updatedCourse;
  }

  @Delete('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(E_ROLE.ADMIN)
  public async delete(@Req() request: Request, @Param('abbr') abbr: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, Course))
      throw new ForbiddenException(
        "You don't have permission to delete course",
      );

    const foundCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
    });

    if (!foundCourse) throw new NotFoundException('Course not found');

    if (!rules.can(E_ACTION.DELETE, foundCourse))
      throw new ForbiddenException(
        "You don't have permission to delete this course",
      );

    return this.coursesService.delete(abbr);
  }
}
