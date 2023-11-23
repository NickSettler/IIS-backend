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
import { CaslAbilityFactory, TAbility } from '../casl/casl-ability.factory';
import { ScheduleService } from './schedule.service';
import {
  E_SCHEDULE_ENTITY_KEYS,
  Schedule,
} from '../db/entities/schedule.entity';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { isArray, omit, pick, reduce, values } from 'lodash';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { handleCustomError, isCustomError, isError } from '../utils/errors';
import { permittedFieldsOf } from '@casl/ability/extra';
import { Class, E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request): Promise<Array<Schedule>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(E_ACTION.READ, Schedule))
      throw new ForbiddenException(
        "You don't have permission to read schedule",
      );

    return this.postProcessResult(await this.scheduleService.findAll(), rules);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Schedule> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(E_ACTION.READ, Schedule))
      throw new ForbiddenException(
        "You don't have permission to read schedule",
      );

    const foundSchedule = await this.scheduleService.fineOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: id,
      },
    });

    if (!rules.can(E_ACTION.READ, foundSchedule))
      throw new ForbiddenException(
        "You don't have permission to read schedule",
      );

    if (!foundSchedule)
      throw new NotFoundException(`Schedule with id ${id} not found`);

    return this.postProcessResult(foundSchedule, rules);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Req() request: Request,
    @Body() createDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(E_ACTION.CREATE, Schedule))
      throw new ForbiddenException(
        "You don't have permission to create schedule",
      );

    const createdSchedule = await this.scheduleService
      .create(createDto)
      .catch((err) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new NotFoundException('Schedule already exists');
        else if (isError(err, 'FOREIGN_KEY_VIOLATION'))
          throw new UnprocessableEntityException(
            'Class/Teacher/Course Activity is not found',
          );
        else if (isCustomError(err)) {
          throw new HttpException(...handleCustomError(err));
        }

        if (err instanceof HttpException) {
          throw err;
        }

        throw new InternalServerErrorException("Can't create schedule");
      });

    const foundSchedule = await this.scheduleService.fineOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: createdSchedule[E_SCHEDULE_ENTITY_KEYS.ID],
      },
    });

    if (!rules.can(E_ACTION.READ, foundSchedule))
      throw new ForbiddenException(
        "You don't have permission to read schedule",
      );

    return this.postProcessResult(foundSchedule, rules);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(E_ACTION.UPDATE, Schedule))
      throw new ForbiddenException(
        "You don't have permission to update schedule",
      );

    const updatableFields = permittedFieldsOf(
      rules,
      E_ACTION.UPDATE,
      Schedule,
      {
        fieldsFrom: (rule) => rule.fields || values(E_SCHEDULE_ENTITY_KEYS),
      },
    );

    const updatedSchedule = await this.scheduleService
      .update(id, pick(updateDto, updatableFields))
      .catch((err) => {
        if (isError(err, 'FOREIGN_KEY_VIOLATION'))
          throw new UnprocessableEntityException(
            'Class/Teacher/Course Activity is not found',
          );
        else if (isCustomError(err)) {
          throw new HttpException(...handleCustomError(err));
        }

        if (err instanceof HttpException) {
          throw err;
        }

        throw new InternalServerErrorException("Can't update schedule");
      });

    const foundSchedule = await this.scheduleService.fineOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: updatedSchedule[E_SCHEDULE_ENTITY_KEYS.ID],
      },
    });

    if (!rules.can(E_ACTION.READ, foundSchedule))
      throw new ForbiddenException(
        "You don't have permission to read schedule",
      );

    return this.postProcessResult(foundSchedule, rules);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(E_ACTION.DELETE, Schedule))
      throw new ForbiddenException(
        "You don't have permission to delete schedule",
      );

    const foundSchedule = await this.scheduleService.fineOne({
      where: {
        [E_SCHEDULE_ENTITY_KEYS.ID]: id,
      },
    });

    if (!rules.can(E_ACTION.DELETE, foundSchedule))
      throw new ForbiddenException(
        "You don't have permission to delete schedule",
      );

    if (!foundSchedule)
      throw new NotFoundException(`Schedule with id ${id} not found`);

    await this.scheduleService.delete(id);
  }

  private postProcessResult(result: Schedule, rules: TAbility): Schedule;
  private postProcessResult(
    result: Array<Schedule>,
    rules: TAbility,
  ): Array<Schedule>;
  private postProcessResult(
    result: Array<Schedule> | Schedule,
    rules: TAbility,
  ) {
    if (isArray(result)) {
      return reduce(
        result,
        (acc, schedule) => {
          return rules.can(E_ACTION.READ, schedule)
            ? [...acc, omit(schedule, [E_SCHEDULE_ENTITY_KEYS.STUDENTS])]
            : acc;
        },
        [],
      );
    } else {
      if (!rules.can(E_ACTION.READ, result))
        throw new ForbiddenException(
          "You don't have permission to read schedule",
        );

      return omit(result, [E_SCHEDULE_ENTITY_KEYS.STUDENTS]);
    }
  }
}
