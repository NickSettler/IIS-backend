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
  Req,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  CourseStudent,
  E_COURSE_STUDENTS_ENTITY_KEYS,
} from '../db/entities/course_students.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CourseStudentsService } from './course-students.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import { CreateCourseStudentDto } from './course-students.dto';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { filter } from 'lodash';
import { handleCustomError, isCustomError, isError } from '../utils/errors';

@Controller('course/students')
export class CourseStudentsController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly courseStudentsService: CourseStudentsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request): Promise<Array<CourseStudent>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, CourseStudent))
      throw new ForbiddenException(
        "You don't have permission to read course students",
      );

    return filter(await this.courseStudentsService.findAll(), (student) =>
      rules.can(E_ACTION.READ, student),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Body() createDto: CreateCourseStudentDto,
    @Req() request: Request,
  ): Promise<CourseStudent> {
    const user = request.user as User;
    const rules = this.caslAbilityFactory.createForUser(user);

    if (
      user[E_USER_ENTITY_KEYS.ID] !==
      createDto[E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT]
    )
      throw new ForbiddenException(
        "You don't have permission to enroll other users to courses",
      );

    if (rules.cannot(E_ACTION.CREATE, CourseStudent))
      throw new ForbiddenException(
        "You don't have permission to create course students",
      );

    await this.courseStudentsService.create(createDto).catch((err) => {
      if (isError(err, 'FOREIGN_KEY_VIOLATION'))
        throw new UnprocessableEntityException('Course or user do not exist');
      else if (isCustomError(err))
        throw new HttpException(...handleCustomError(err));

      throw new InternalServerErrorException("Can't create course student");
    });

    const foundCourseStudent = await this.courseStudentsService.findOne({
      where: {
        [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID]:
          createDto[E_COURSE_STUDENTS_ENTITY_KEYS.COURSE],
        [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID]:
          createDto[E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT],
      },
    });

    if (!rules.can(E_ACTION.READ, foundCourseStudent))
      throw new ForbiddenException(
        "You don't have permission to read this course student",
      );

    return foundCourseStudent;
  }

  @Delete('/:studentID/:courseID')
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Req() request: Request,
    @Param('studentID') studentID: string,
    @Param('courseID') courseID: string,
  ): Promise<void> {
    const user = request.user as User;
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (user[E_USER_ENTITY_KEYS.ID] !== studentID)
      throw new ForbiddenException(
        "You don't have permission to delete other users from courses",
      );

    if (rules.cannot(E_ACTION.DELETE, CourseStudent))
      throw new ForbiddenException(
        "You don't have permission to delete course students",
      );

    const foundCourseStudent = await this.courseStudentsService.findOne({
      where: {
        [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID]: courseID,
        [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID]: studentID,
      },
    });

    if (!foundCourseStudent)
      throw new NotFoundException('Course student not found');

    if (!rules.can(E_ACTION.DELETE, foundCourseStudent))
      throw new ForbiddenException(
        "You don't have permission to delete this course student",
      );

    await this.courseStudentsService.delete(courseID, studentID);
  }
}
