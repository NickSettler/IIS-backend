import { Injectable } from '@nestjs/common';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { E_ACTION } from './actions';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { Class } from '../db/entities/class.entity';
import { CourseActivity } from '../db/entities/course_activity.entity';
import { Schedule } from '../db/entities/schedule.entity';
import { map, values } from 'lodash';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';

export type TSubjects =
  | InferSubjects<
      | typeof Class
      | typeof Course
      | typeof CourseActivity
      | typeof Schedule
      | typeof User
    >
  | 'all';

export type TAbility = MongoAbility<[E_ACTION, TSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  private static applyStudentRules(can: (...params: any) => void): void {
    can(E_ACTION.READ, Class);
    can(E_ACTION.READ, CourseActivity, ['**']);
    can(E_ACTION.READ, Course, ['**']);
    can(E_ACTION.READ, Schedule);
  }

  private static applySchedulerRules(can: (...params: any) => void): void {
    can(values(E_ACTION), Schedule);
  }

  public createForUser(user: User | undefined): TAbility {
    const { can, build } = new AbilityBuilder<TAbility>(createMongoAbility);

    can(E_ACTION.READ, Course, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.ANNOTATION,
    ]);

    const userRoles: Array<E_ROLE> = map(
      user?.[E_USER_ENTITY_KEYS.ROLES],
      E_ROLE_ENTITY_KEYS.NAME,
    );

    if (userRoles.includes(E_ROLE.STUDENT)) {
      CaslAbilityFactory.applyStudentRules(can);
    }

    if (userRoles.includes(E_ROLE.SCHEDULER)) {
      CaslAbilityFactory.applyStudentRules(can);
      CaslAbilityFactory.applySchedulerRules(can);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<TSubjects>,
    });
  }
}
