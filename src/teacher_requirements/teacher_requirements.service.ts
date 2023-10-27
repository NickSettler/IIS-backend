import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TeacherRequirement,
} from '../db/entities/teacher_requirement.entity';
import { Repository } from 'typeorm';
import {
  CreateTeacherRequirementsDto,
  UpdateTeacherRequirementsDto,
} from './teacher_requirements.dto';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { assign, isArray, omitBy } from 'lodash';

@Injectable()
export class TeacherRequirementsService {
  constructor(
    @InjectRepository(TeacherRequirement)
    private teacherRequirementsRepository: Repository<TeacherRequirement>,
  ) {}

  /**
   * Find all teacherRequirements
   */
  public async findAll(): Promise<Array<TeacherRequirement>> {
    return this.teacherRequirementsRepository.find();
  }

  /**
   * Find one teacherRequirement using options
   * @param options
   */
  public async findOne(options: any) {
    return this.teacherRequirementsRepository.findOne(options);
  }

  /**
   * Create a teacherRequirement
   * @param createDto
   */
  public async create(
    createDto: CreateTeacherRequirementsDto,
  ): Promise<TeacherRequirement> {
    const newTeacherRequirement = this.teacherRequirementsRepository.create({
      ...createDto,
      ...(createDto[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER] && {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: {
          [E_USER_ENTITY_KEYS.ID]:
            createDto[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER],
        },
      }),
    });

    return await this.teacherRequirementsRepository.save(newTeacherRequirement);
  }

  /**
   * Update a teacherRequirement
   * @param id
   * @param updateDto
   */
  public async update(
    id: string,
    updateDto: UpdateTeacherRequirementsDto,
  ): Promise<TeacherRequirement> {
    const teacherRequirementToUpdate =
      await this.teacherRequirementsRepository.findOne({
        where: {
          [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
        },
      });

    if (!teacherRequirementToUpdate) {
      throw new ConflictException('Teacher requirement not found');
    }

    assign(teacherRequirementToUpdate, omitBy(updateDto, isArray));

    await this.teacherRequirementsRepository.save({
      ...teacherRequirementToUpdate,
      ...(updateDto[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER] && {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: {
          [E_USER_ENTITY_KEYS.ID]:
            updateDto[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER],
        },
      }),
    });

    return this.teacherRequirementsRepository.findOne({
      where: {
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
      },
    });
  }

  /**
   * Delete a teacherRequirement
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const deletedTeacherRequirement =
      await this.teacherRequirementsRepository.findOne({
        where: { [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id },
      });

    if (!deletedTeacherRequirement) {
      throw new ConflictException('Teacher requirement not found');
    }

    await this.teacherRequirementsRepository.delete(id);
  }
}
