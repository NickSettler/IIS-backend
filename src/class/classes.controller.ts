import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import RolesGuard from '../common/guards/roles.guard';
import { CreateClassDto, UpdateClassDto } from './classes.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classService: ClassesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async getAll() {
    return this.classService.findAll();
  }

  @Get('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async getOne(@Param('abbr') abbr: string) {
    return this.classService.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  public async create(@Body() createDto: CreateClassDto) {
    return this.classService.create(createDto);
  }

  @Put('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async update(
    @Param('abbr') abbr: string,
    @Body() updateDto: UpdateClassDto,
  ) {
    return this.classService.update(abbr, updateDto);
  }

  @Delete('/:abbr')
  public async delete(@Param('abbr') abbr: string) {
    return this.classService.delete(abbr);
  }
}
