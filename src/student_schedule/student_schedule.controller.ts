import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { StudentScheduleService } from './student_schedule.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  E_STUDENT_SCHEDULE_ENTITY_KEYS,
  StudentSchedule,
} from '../db/entities/student_schedule.entity';
import { E_ACTION } from '../casl/actions';
import { filter } from 'lodash';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { UsersService } from '../users/users.service';

@Controller('')
export class StudentScheduleController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly studentScheduleService: StudentScheduleService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Get all student's schedules
   * @param request
   * @param studentId
   */
  @Get('/student/:studentId/schedule')
  @UseGuards(JwtAuthGuard)
  public async getAllForStudent(
    @Req() request: Request,
    @Param('studentId') studentId: string,
  ): Promise<Array<StudentSchedule>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to read student_schedule",
      );

    const foundItems =
      await this.studentScheduleService.findAllForStudent(studentId);

    if (!foundItems.length) throw new NotFoundException('Student is not found');

    return filter(foundItems, (student_schedule) =>
      rules.can(E_ACTION.READ, student_schedule),
    );
  }

  /**
   * Get all schedule's students
   * @param request
   * @param scheduleId
   */
  @Get('/schedule/:scheduleId/student')
  @UseGuards(JwtAuthGuard)
  public async getAllForSchedule(
    @Req() request: Request,
    @Param('scheduleId') scheduleId: string,
  ): Promise<Array<StudentSchedule>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to read student_schedule",
      );

    const foundItems =
      await this.studentScheduleService.findAllForSchedule(scheduleId);

    if (!foundItems.length)
      throw new NotFoundException('Schedule item is not found');

    return filter(foundItems, (student_schedule) =>
      rules.can(E_ACTION.READ, student_schedule),
    );
  }

  /**
   * Create student's schedule item
   * @param request
   * @param studentId
   * @param scheduleId
   */
  @Post('/student/:studentId/schedule/:scheduleId')
  @UseGuards(JwtAuthGuard)
  public async create(
    @Req() request: Request,
    @Param('studentId') studentId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<StudentSchedule> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to create student_schedule",
      );

    const foundStudent = await this.userService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: studentId,
      },
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    // TODO: check schedule when it is implemented

    return await this.studentScheduleService.create({
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: studentId,
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: scheduleId,
    });
  }

  /**
   * Create schedule's student item
   * @param request
   * @param studentId
   * @param scheduleId
   */
  @Post('/schedule/:scheduleId/student/:studentId')
  @UseGuards(JwtAuthGuard)
  public async createForSchedule(
    @Req() request: Request,
    @Param('studentId') studentId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<StudentSchedule> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to create student_schedule",
      );

    const foundStudent = await this.userService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: studentId,
      },
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    // TODO: check schedule when it is implemented

    return await this.studentScheduleService.create({
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: studentId,
      [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: scheduleId,
    });
  }

  /**
   * Delete student's schedule item
   * @param request
   * @param studentId
   * @param scheduleId
   */
  @Delete('/student/:studentId/schedule/:scheduleId')
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Req() request: Request,
    @Param('studentId') studentId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<void> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to delete student_schedule",
      );

    const foundStudentSchedule = await this.studentScheduleService.findOne(
      studentId,
      scheduleId,
    );
    if (!foundStudentSchedule)
      throw new NotFoundException('Student schedule not found');

    await this.studentScheduleService.delete(studentId, scheduleId);
  }

  /**
   * Delete schedule's student item
   * @param request
   * @param studentId
   * @param scheduleId
   */
  @Delete('/schedule/:scheduleId/student/:studentId')
  @UseGuards(JwtAuthGuard)
  public async deleteForSchedule(
    @Req() request: Request,
    @Param('studentId') studentId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<void> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, StudentSchedule))
      throw new ForbiddenException(
        "You don't have permission to delete student_schedule",
      );

    const foundStudentSchedule = await this.studentScheduleService.findOne(
      studentId,
      scheduleId,
    );
    if (!foundStudentSchedule)
      throw new NotFoundException('Student schedule not found');

    await this.studentScheduleService.delete(studentId, scheduleId);
  }
}
