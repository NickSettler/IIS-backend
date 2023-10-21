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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Class, E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateClassDto, UpdateClassDto } from './classes.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Request } from 'express';
import { User } from '../db/entities/user.entity';
import { E_ACTION } from '../casl/actions';
import { filter } from 'lodash';
import { isError } from 'src/utils/errors';

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly classService: ClassesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, Class))
      throw new ForbiddenException("You don't have permission to read classes");

    const foundClasses = filter(await this.classService.findAll(), (fClass) =>
      rules.can(E_ACTION.READ, fClass),
    );

    return foundClasses;
  }

  @Get('/:abbr')
  @UseGuards(JwtAuthGuard)
  public async getOne(@Req() request: Request, @Param('abbr') abbr: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, Class))
      throw new ForbiddenException("You don't have permission to read classes");

    const foundClass = await this.classService.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!foundClass) throw new NotFoundException('Class not found');

    if (!rules.can(E_ACTION.READ, foundClass))
      throw new ForbiddenException(
        "You don't have permission to read this class",
      );

    return foundClass;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Req() request: Request,
    @Body() createDto: CreateClassDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, Class))
      throw new ForbiddenException("You don't have permission to create class");

    const createdClass = await this.classService
      .create(createDto)
      .catch((err: any) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new ConflictException('Class already exists');
        else throw new InternalServerErrorException("Can't create class");
      });

    if (!rules.can(E_ACTION.READ, createdClass))
      throw new ForbiddenException(
        "You don't have permission to read this class",
      );

    return createdClass;
  }

  @Put('/:abbr')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Req() request: Request,
    @Param('abbr') abbr: string,
    @Body() updateDto: UpdateClassDto,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, Class))
      throw new ForbiddenException("You don't have permission to update class");

    const foundClass = await this.classService.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!foundClass) throw new NotFoundException('Class not found');

    if (!rules.can(E_ACTION.UPDATE, foundClass))
      throw new ForbiddenException(
        "You don't have permission to update this class",
      );

    const updatedClass = await this.classService.update(abbr, updateDto);

    if (!rules.can(E_ACTION.READ, updatedClass))
      throw new ForbiddenException(
        "You don't have permission to read this class",
      );

    return updatedClass;
  }

  @Delete('/:abbr')
  public async delete(@Req() request: Request, @Param('abbr') abbr: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, Class))
      throw new ForbiddenException("You don't have permission to delete class");

    const foundClass = await this.classService.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!foundClass) throw new NotFoundException('Class not found');

    if (!rules.can(E_ACTION.DELETE, foundClass))
      throw new ForbiddenException(
        "You don't have permission to delete this class",
      );

    return this.classService.delete(abbr);
  }
}
