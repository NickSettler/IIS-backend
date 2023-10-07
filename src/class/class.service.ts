import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '../db/entities/class.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateClassDto } from './class.dto';
import { E_DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class ClassService {
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
      if (err.code === E_DB_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('Class already exists');
      else throw new InternalServerErrorException("Can't create class");
    });
  }

  /**
   * Update a class
   */

  /**
   * Delete a class
   * @param id class id
   */
  public async delete(id: string): Promise<void> {
    await this.classRepository.delete(id);
  }
}
