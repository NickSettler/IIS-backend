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
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import RolesGuard from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { E_ROLE } from '../db/entities/role.entity';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { CreateCoursesDto, UpdateCourseDto } from './courses.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    E_ROLE.ADMIN,
    E_ROLE.TEACHER,
    E_ROLE.STUDENT,
    E_ROLE.GUARANTOR,
    E_ROLE.GUEST,
  )
  public async getAll(): Promise<Array<Course>> {
    return this.coursesService.findAll();
  }

  @Get('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    E_ROLE.ADMIN,
    E_ROLE.TEACHER,
    E_ROLE.STUDENT,
    E_ROLE.GUARANTOR,
    E_ROLE.GUEST,
  )
  public async getOne(@Param('abbr') abbr: string): Promise<Course> {
    return this.coursesService.findOne({
      where: {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(E_ROLE.ADMIN)
  public async create(@Body() createDto: CreateCoursesDto): Promise<Course> {
    return this.coursesService.create(createDto);
  }

  @Put('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(E_ROLE.ADMIN)
  public async update(
    @Param('abbr') abbr: string,
    @Body() updateDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(abbr, updateDto);
  }

  @Delete('/:abbr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(E_ROLE.ADMIN)
  public async delete(@Param('abbr') abbr: string) {
    return this.coursesService.delete(abbr);
  }
}
