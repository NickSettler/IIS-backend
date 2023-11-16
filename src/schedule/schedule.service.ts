import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  E_SCHEDULE_ENTITY_KEYS,
  Schedule,
} from '../db/entities/schedule.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../db/entities/course_activity.entity';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { assign } from 'lodash';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  public async findAll(
    options?: FindManyOptions<Schedule>,
  ): Promise<Array<Schedule>> {
    return await this.scheduleRepository.find(options);
  }

  public async fineOne(options?: FindOneOptions<Schedule>): Promise<Schedule> {
    return this.scheduleRepository.findOne(options);
  }

  public async create(createDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(this.processDTO(createDto));

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
        [E_SCHEDULE_ENTITY_KEYS.CLASS]: {
          [E_CLASS_ENTITY_KEYS.ID]: dto[E_SCHEDULE_ENTITY_KEYS.CLASS],
        },
      }),
      ...(dto[E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY] && {
        [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY]: {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
            dto[E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY],
        },
      }),
      ...(dto[E_SCHEDULE_ENTITY_KEYS.TEACHER] && {
        [E_SCHEDULE_ENTITY_KEYS.TEACHER]: {
          [E_USER_ENTITY_KEYS.ID]: dto[E_SCHEDULE_ENTITY_KEYS.TEACHER],
        },
      }),
    };
  }
}
