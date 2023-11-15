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
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { filter } from 'lodash';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TeacherRequirement,
} from '../db/entities/teacher_requirement.entity';
import { TeacherRequirementsService } from './teacher_requirements.service';
import {
  CreateTeacherRequirementsDto,
  UpdateTeacherRequirementsDto,
} from './teacher_requirements.dto';
import { handleCustomError, isCustomError, isError } from '../utils/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('teacher/requirements')
export class TeacherRequirementsController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly teacherRequirementsService: TeacherRequirementsService,
  ) {}

  /**
   * Find all course activities
   * @param request
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(
    @Req() request: Request,
  ): Promise<Array<TeacherRequirement>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to read teacher requirements",
      );

    return filter(
      await this.teacherRequirementsService.findAll(),
      (requirement) => rules.can(E_ACTION.READ, requirement),
    );
  }

  /**
   * Find one course activity by id
   * @param id course activity id
   * @param request
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<TeacherRequirement> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to read teacher requirements",
      );

    const foundRequirement = await this.teacherRequirementsService.findOne({
      where: {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundRequirement)
      throw new NotFoundException(`Teacher requirement not found`);

    if (!rules.can(E_ACTION.READ, foundRequirement))
      throw new ForbiddenException(
        "You don't have permission to read this teacher requirement",
      );

    return foundRequirement;
  }
  @Get('/teacher/:id')
  @UseGuards(JwtAuthGuard)
  public async getForTeacher(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Array<TeacherRequirement>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to read teacher requirements",
      );

    return filter(
      await this.teacherRequirementsService.findAll({
        where: {
          [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER_ID]: id,
        },
      }),
      (requirement) => rules.can(E_ACTION.READ, requirement),
    );
  }

  /**
   * Create a teacher requirement
   * @param request
   * @param createDto
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Req() request: Request,
    @Body() createDto: CreateTeacherRequirementsDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to create teacher requirements",
      );

    const createdRequirement = await this.teacherRequirementsService
      .create(createDto)
      .catch((err) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new NotFoundException('Teacher requirement already exists');
        else if (isError(err, 'FOREIGN_KEY_VIOLATION'))
          throw new UnprocessableEntityException('Teacher not found');
        else if (isCustomError(err)) {
          throw new HttpException(...handleCustomError(err));
        }

        throw new InternalServerErrorException(
          "Can't create teacher requirement",
        );
      });

    const foundTeacherRequirement =
      await this.teacherRequirementsService.findOne({
        where: {
          [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]:
            createdRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
        },
      });

    if (!rules.can(E_ACTION.READ, foundTeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to read this teacher requirement",
      );

    return foundTeacherRequirement;
  }

  /**
   * Update a teacher requirement
   * @param id teacher requirement id
   * @param request
   * @param updateDto
   */
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateDto: UpdateTeacherRequirementsDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to update teacher requirements",
      );

    const foundRequirement = await this.teacherRequirementsService.findOne({
      where: {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundRequirement)
      throw new NotFoundException(`Teacher requirement not found`);

    if (!rules.can(E_ACTION.UPDATE, foundRequirement))
      throw new ForbiddenException(
        "You don't have permission to update this teacher requirement",
      );

    const updatedTeacherRequirement = await this.teacherRequirementsService
      .update(id, updateDto)
      .catch((err) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new NotFoundException('Teacher requirement already exists');
        else if (isError(err, 'FOREIGN_KEY_VIOLATION'))
          throw new UnprocessableEntityException('Teacher not found');
        else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException(
          "Can't update teacher requirement",
        );
      });

    const foundUpdatedTeacherRequirement =
      await this.teacherRequirementsService.findOne({
        where: {
          [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]:
            updatedTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
        },
      });

    if (!rules.can(E_ACTION.READ, foundUpdatedTeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to read this teacher requirement",
      );

    return foundUpdatedTeacherRequirement;
  }

  /**
   * Delete a teacher requirement
   * @param id
   * @param request
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id') id: string, @Req() request: Request) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, TeacherRequirement))
      throw new ForbiddenException(
        "You don't have permission to delete teacher requirements",
      );

    const foundRequirement = await this.teacherRequirementsService.findOne({
      where: {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundRequirement)
      throw new NotFoundException(`Teacher requirement not found`);

    if (!rules.can(E_ACTION.DELETE, foundRequirement))
      throw new ForbiddenException(
        "You don't have permission to delete this teacher requirement",
      );

    return this.teacherRequirementsService.delete(id);
  }
}
