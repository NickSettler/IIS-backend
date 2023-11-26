import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  E_SCHEDULE_ENTITY_KEYS,
  Schedule,
} from '../db/entities/schedule.entity';
import { DeepPartial, FindOneOptions, Not, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../db/entities/course_activity.entity';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { assign, isArray, isEmpty, map } from 'lodash';
import * as dayjs from 'dayjs';
import { rrulestr } from 'rrule';
import { checkDatesOverlap } from '../utils/datetime/overlap';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  public async findAll(
    options?: FindManyOptions<Schedule>,
  ): Promise<Array<Schedule>> {
    return await this.scheduleRepository.find({
      ...options,
      relations: [
        ...(isArray(options?.relations) ? options.relations : []),
        E_SCHEDULE_ENTITY_KEYS.STUDENTS,
        `${E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY}.${E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE}`,
      ],
    });
  }

  public async fineOne(options?: FindOneOptions<Schedule>): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      ...options,
      relations: [
        ...(isArray(options?.relations) ? options.relations : []),
        E_SCHEDULE_ENTITY_KEYS.STUDENTS,
        `${E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY}.${E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE}`,
      ],
    });
  }

  public async create(createDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(this.processDTO(createDto));

    await this.checkConflicts(schedule);

    this.autoCorrectScheduleDates(schedule);

    return await this.scheduleRepository.save(schedule);
  }

  public async update(
    id: Schedule[E_SCHEDULE_ENTITY_KEYS.ID],
    updateDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const foundSchedule = await this.scheduleRepository.findOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundSchedule)
      throw new NotFoundException(`Schedule with id ${id} not found`);

    assign(foundSchedule, this.processDTO(updateDto));

    await this.checkConflicts(foundSchedule);

    this.autoCorrectScheduleDates(foundSchedule);

    await this.scheduleRepository.save(foundSchedule);

    return this.scheduleRepository.findOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: id,
      },
    });
  }

  public async delete(id: Schedule[E_SCHEDULE_ENTITY_KEYS.ID]) {
    const foundSchedule = await this.scheduleRepository.findOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundSchedule)
      throw new NotFoundException(`Schedule with id ${id} not found`);

    await this.scheduleRepository.delete(id);
  }

  private processDTO(
    dto: CreateScheduleDto | UpdateScheduleDto,
  ): DeepPartial<Schedule> {
    return {
      ...dto,
      ...(dto[E_SCHEDULE_ENTITY_KEYS.CLASS] && {
        [E_SCHEDULE_ENTITY_KEYS.CLASS_ID]: dto[E_SCHEDULE_ENTITY_KEYS.CLASS],
        [E_SCHEDULE_ENTITY_KEYS.CLASS]: {
          [E_CLASS_ENTITY_KEYS.ID]: dto[E_SCHEDULE_ENTITY_KEYS.CLASS],
        },
      }),
      ...(dto[E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY] && {
        [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID]:
          dto[E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY],
        [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY]: {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
            dto[E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY],
        },
      }),
      ...(dto[E_SCHEDULE_ENTITY_KEYS.TEACHER] && {
        [E_SCHEDULE_ENTITY_KEYS.TEACHER_ID]:
          dto[E_SCHEDULE_ENTITY_KEYS.TEACHER],
        [E_SCHEDULE_ENTITY_KEYS.TEACHER]: {
          [E_USER_ENTITY_KEYS.ID]: dto[E_SCHEDULE_ENTITY_KEYS.TEACHER],
        },
      }),
    };
  }

  private getScheduleTimeDiff(schedule: Schedule): number {
    const startDate = dayjs(schedule[E_SCHEDULE_ENTITY_KEYS.START_TIME]);
    const endDate = dayjs(schedule[E_SCHEDULE_ENTITY_KEYS.END_TIME]);

    return endDate.diff(startDate, 'ms') % (1000 * 60 * 60 * 24);
  }

  private autoCorrectScheduleDates(schedule: Schedule): void {
    const diff = this.getScheduleTimeDiff(schedule);

    const startDate = dayjs(schedule[E_SCHEDULE_ENTITY_KEYS.START_TIME]);
    const endDate = startDate.add(diff, 'ms');

    assign(schedule, {
      [E_SCHEDULE_ENTITY_KEYS.START_TIME]: startDate.toDate(),
      [E_SCHEDULE_ENTITY_KEYS.END_TIME]: endDate.toDate(),
    });
  }

  private getScheduleDates(schedule: Schedule): Array<[Date, Date]> {
    const startDate = dayjs(schedule[E_SCHEDULE_ENTITY_KEYS.START_TIME]);
    const endDate = dayjs(schedule[E_SCHEDULE_ENTITY_KEYS.END_TIME]);

    if (isEmpty(schedule[E_SCHEDULE_ENTITY_KEYS.RECURRENCE_RULE]))
      return [[startDate.toDate(), endDate.toDate()]];

    const diff = this.getScheduleTimeDiff(schedule);

    const rule = rrulestr(schedule[E_SCHEDULE_ENTITY_KEYS.RECURRENCE_RULE], {
      dtstart: startDate.toDate(),
    });

    return map(rule.all(), (date) => [
      date,
      dayjs(date).add(diff, 'ms').toDate(),
    ]);
  }

  private async checkTeacherConflicts(schedule: Schedule) {
    const teacherScheduleItems = await this.scheduleRepository.find({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.TEACHER_ID]:
          schedule[E_SCHEDULE_ENTITY_KEYS.TEACHER_ID],
        ...(schedule[E_SCHEDULE_ENTITY_KEYS.ID] && {
          [E_SCHEDULE_ENTITY_KEYS.ID]: Not(schedule[E_SCHEDULE_ENTITY_KEYS.ID]),
        }),
      },
    });

    const teacherScheduleDates = teacherScheduleItems.reduce<
      Array<[Date, Date]>
    >((acc, scheduleItem) => {
      return [...acc, ...this.getScheduleDates(scheduleItem)];
    }, []);

    const scheduleDates = this.getScheduleDates(schedule);

    if (checkDatesOverlap(teacherScheduleDates, scheduleDates))
      throw new ConflictException('Teacher is busy at this time');
  }

  private async checkClassConflicts(schedule: Schedule) {
    const classScheduleItems = await this.scheduleRepository.find({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.CLASS_ID]:
          schedule[E_SCHEDULE_ENTITY_KEYS.CLASS_ID],
        ...(schedule[E_SCHEDULE_ENTITY_KEYS.ID] && {
          [E_SCHEDULE_ENTITY_KEYS.ID]: Not(schedule[E_SCHEDULE_ENTITY_KEYS.ID]),
        }),
      },
    });

    const classScheduleDates = classScheduleItems.reduce<Array<[Date, Date]>>(
      (acc, scheduleItem) => {
        return [...acc, ...this.getScheduleDates(scheduleItem)];
      },
      [],
    );

    const scheduleDates = this.getScheduleDates(schedule);

    if (checkDatesOverlap(classScheduleDates, scheduleDates))
      throw new ConflictException('Class is busy at this time');
  }

  private async checkConflicts(schedule: Schedule) {
    await this.checkTeacherConflicts(schedule);
    await this.checkClassConflicts(schedule);
  }
}
