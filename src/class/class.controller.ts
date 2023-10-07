import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ClassService } from './class.service';
import { E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  /*
   * Get all classes
   */
  @Get()
  public async getAll() {
    return this.classService.findAll();
  }

  /*
   * Get one class by abbreviation
   * @param abbr
   */
  @Get('/:abbr')
  public async getOne(@Param('abbr') abbr: string) {
    return this.classService.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });
  }

  /*
   * Delete a class
   * @param abbr
   */
  @Delete('/:id')
  public async delete(@Param('abbr') abbr: string) {
    return this.classService.delete(abbr);
  }
}
