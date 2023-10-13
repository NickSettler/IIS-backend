import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateClassDto, UpdateClassDto } from './classes.dto';
import { E_POSTGRES_ERROR_CODES } from '../db/constants';

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

    return await this.classRepository.save(newClass).catch((err: any) => {
      if (err.code === E_POSTGRES_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('Class already exists');
      else throw new InternalServerErrorException("Can't create class");
    });
  }

  /**
   * Update a class
   * @param abbr
   * @param updateDto
   */
  public async update(abbr: string, updateDto: UpdateClassDto): Promise<Class> {
    const classToUpdate = await this.classRepository.findOne({
      where: { [E_CLASS_ENTITY_KEYS.ABBR]: abbr },
    });

    if (!classToUpdate) throw new ConflictException('Class not found');

    const updatedClass = this.classRepository.merge(classToUpdate, updateDto);

    return await this.classRepository.save(updatedClass);
  }

  /**
   * Delete a class
   * @param abbr
   */
  public async delete(abbr: string): Promise<void> {
    await this.classRepository.delete(abbr);
  }
}
