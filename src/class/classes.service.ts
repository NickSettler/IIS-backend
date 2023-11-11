import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateClassDto, UpdateClassDto } from './classes.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  /**
   * Find all classes
   */
  public async findAll(): Promise<Array<Class>> {
    return this.classRepository.find();
  }

  /**
   * Find one class using options
   * @param options
   */
  public async findOne(options: FindOneOptions<Class>): Promise<Class | null> {
    return this.classRepository.findOne(options);
  }

  /**
   * Create a class
   * @param createDto class data
   */
  public async create(createDto: CreateClassDto): Promise<Class> {
    const newClass = this.classRepository.create(createDto);

    return await this.classRepository.save(newClass);
  }

  /**
   * Update a class
   * @param id
   * @param updateDto
   */
  public async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const classToUpdate = await this.classRepository.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ID]: id },
    });

    if (!classToUpdate) throw new ConflictException('Class not found');

    const updatedClass = this.classRepository.merge(classToUpdate, updateDto);

    return await this.classRepository.save(updatedClass);
  }

  /**
   * Delete a class
   * @param id
   */
  public async delete(id: string): Promise<void> {
    await this.classRepository.delete(id);
  }
}
