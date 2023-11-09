import {
  Body,
  ConflictException,
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
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import {
  CreateCoursesDto,
  ManageCourseTeachersDto,
  UpdateCourseDto,
} from './courses.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { Request } from 'express';
import { CaslAbilityFactory, TAbility } from '../casl/casl-ability.factory';
import { filter, map, union } from 'lodash';
import { handleCustomError, isCustomError, isError } from '../utils/errors';

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

    return filter(await this.coursesService.findAll(), (course) =>
      rules.can(E_ACTION.READ, course),
    );
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
        } else if (isError(err, 'STRING_DATA_RIGHT_TRUNCATION')) {
          throw new UnprocessableEntityException('Some data is wrong');
        } else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException('Something went wrong');
      });

    const foundCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: createdCourse[E_COURSE_ENTITY_KEYS.ABBR],
      },
    });

    if (!rules.can(E_ACTION.READ, foundCourse))
      throw new ForbiddenException(
        "You don't have permission to read this course",
      );

    return foundCourse;
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
        if (isError(err, 'UNIQUE_CONSTRAINT')) {
          throw new ConflictException('Course already exists');
        } else if (isError(err, 'FOREIGN_KEY_VIOLATION')) {
          if (err.constraint === 'fk_guarantor_id') {
            throw new UnprocessableEntityException('Guarantor does not exist');
          }
        } else if (isError(err, 'STRING_DATA_RIGHT_TRUNCATION')) {
          throw new UnprocessableEntityException('Some data is wrong');
        } else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException('Something went wrong');
      });

    const foundUpdatedCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: updatedCourse[E_COURSE_ENTITY_KEYS.ABBR],
      },
    });

    if (!rules.can(E_ACTION.READ, foundUpdatedCourse))
      throw new ForbiddenException(
        "You don't have permission to read this course",
      );

    return foundUpdatedCourse;
  }

  @Delete('/:abbr')
  @UseGuards(JwtAuthGuard)
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

  @Post('/:abbr/teachers')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async addTeachers(
    @Req() request: Request,
    @Param('abbr') abbr: string,
    @Body() manageCourseTeachersDto: ManageCourseTeachersDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    const foundTeachers = await this.getCourseTeachers(rules, abbr);

    const newTeachers = union(foundTeachers, manageCourseTeachersDto.teachers);

    return this.update(request, abbr, {
      [E_COURSE_ENTITY_KEYS.TEACHERS]: newTeachers,
    });
  }

  @Delete('/:abbr/teachers')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async deleteTeachers(
    @Req() request: Request,
    @Param('abbr') abbr: string,
    @Body() manageCourseTeachersDto: ManageCourseTeachersDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    const foundTeachers = await this.getCourseTeachers(rules, abbr);

    const newTeachers = filter(
      foundTeachers,
      (teacher) => !manageCourseTeachersDto.teachers.includes(teacher),
    );

    return this.update(request, abbr, {
      [E_COURSE_ENTITY_KEYS.TEACHERS]: newTeachers,
    });
  }

  private async getCourseTeachers(
    rules: TAbility,
    abbr: string,
  ): Promise<Array<string>> {
    if (rules.cannot(E_ACTION.UPDATE, Course, E_COURSE_ENTITY_KEYS.TEACHERS))
      throw new ForbiddenException(
        "You don't have permission to update course",
      );

    const foundCourse = await this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
    });

    if (!foundCourse) throw new NotFoundException('Course not found');

    if (!rules.can(E_ACTION.UPDATE, foundCourse, E_COURSE_ENTITY_KEYS.TEACHERS))
      throw new ForbiddenException(
        "You don't have permission to update this course",
      );

    return map(
      foundCourse[E_COURSE_ENTITY_KEYS.TEACHERS],
      (teacher) => teacher[E_USER_ENTITY_KEYS.ID],
    );
  }
}
