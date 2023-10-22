import { Injectable } from '@nestjs/common';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { E_ACTION, E_MANAGE_ACTION } from './actions';
import { Course, E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { Class } from '../db/entities/class.entity';
import {
  CourseActivity,
  E_COURSE_ACTIVITY_ENTITY_KEYS,
} from '../db/entities/course_activity.entity';
import {
  E_SCHEDULE_ENTITY_KEYS,
  Schedule,
} from '../db/entities/schedule.entity';
import { map } from 'lodash';
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

export type TAbility = MongoAbility<
  [E_ACTION | typeof E_MANAGE_ACTION, TSubjects]
>;

@Injectable()
export class CaslAbilityFactory {
  private static applyStudentRules(
    user: User,
    can: (...params: any) => void,
  ): void {
    can(E_ACTION.READ, Class);
    can(E_ACTION.READ, CourseActivity, ['**']);
    can(E_ACTION.READ, Course, ['**']);
    can(E_ACTION.READ, Schedule);
    can(E_ACTION.CREATE, Schedule, [`${E_SCHEDULE_ENTITY_KEYS.STUDENTS}.*`]);
    can(E_ACTION.DELETE, Schedule, [`${E_SCHEDULE_ENTITY_KEYS.STUDENTS}.*`], {
      [E_SCHEDULE_ENTITY_KEYS.STUDENTS]: {
        [E_USER_ENTITY_KEYS.ID]: user[E_USER_ENTITY_KEYS.ID],
      },
    });
  }

  private static applySchedulerRules(can: (...params: any) => void): void {
    can(E_MANAGE_ACTION, Schedule);
  }

  public createForUser(user: User | undefined): TAbility {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { can, cannot, build } = new AbilityBuilder<TAbility>(
      createMongoAbility,
    );

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
      CaslAbilityFactory.applyStudentRules(user, can);
    }

    if (userRoles.includes(E_ROLE.SCHEDULER)) {
      CaslAbilityFactory.applyStudentRules(user, can);
      CaslAbilityFactory.applySchedulerRules(can);
    }

    if (userRoles.includes(E_ROLE.ADMIN)) {
      can(E_MANAGE_ACTION, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<TSubjects>,
    });
  }
}
