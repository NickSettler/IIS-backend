import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { Test } from '@nestjs/testing';
import { CaslAbilityFactory, TAbility } from './casl-ability.factory';
import { E_ACTION, E_MANAGE_ACTION } from './actions';
import { constant, reduce, times, values } from 'lodash';
import { map } from 'lodash';
import { Course } from '../db/entities/course.entity';
import { Class } from '../db/entities/class.entity';
import { Schedule } from '../db/entities/schedule.entity';
import { CourseActivity } from '../db/entities/course_activity.entity';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';

export const generateExpected = (
  actions: Array<E_ACTION>,
  expected: Array<boolean>,
): Partial<Record<E_ACTION, boolean>> => {
  if (actions.length !== expected.length)
    throw new Error('actions and expected arrays must have the same length');

  return reduce(
    actions,
    (acc, action, index) => ({
      ...acc,
      [action]: expected[index],
    }),
    {},
  );
};

describe('CaslAbilityFactory test', () => {
  let abilityFactory: CaslAbilityFactory;
  let user: User;
  let ability: TAbility;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CaslAbilityFactory],
    }).compile();

    abilityFactory = await module.resolve(CaslAbilityFactory);
  });

  describe('Guest user', () => {
    beforeEach(() => {
      ability = abilityFactory.createForUser(user);
    });

    describe('Users', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} users`, () => {
          expect(ability.can(action, User)).toEqual(value);
        });
      });
    });

    describe('Class', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} classes`, () => {
          expect(ability.can(action, Class)).toEqual(value);
        });
      });
    });

    describe('Course', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} courses`, () => {
          expect(ability.can(action, Course)).toEqual(value);
        });
      });
    });

    describe('Course activity', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} course activities`, () => {
          expect(ability.can(action, CourseActivity)).toEqual(value);
        });
      });
    });

    describe('Schedule', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} schedule items`, () => {
          expect(ability.can(action, Schedule)).toEqual(value);
        });
      });
    });
  });

  describe('Student', () => {
    beforeEach(() => {
      user = new User();
      user[E_USER_ENTITY_KEYS.ROLES] = [
        {
          [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE.STUDENT,
          [E_ROLE_ENTITY_KEYS.PERMISSIONS]: [],
        },
      ];
      ability = abilityFactory.createForUser(user);
    });

    describe('Users', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} users`, () => {
          expect(ability.can(action, User)).toEqual(value);
        });
      });
    });

    describe('Class', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} classes`, () => {
          expect(ability.can(action, Class)).toEqual(value);
        });
      });
    });

    describe('Course', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} courses`, () => {
          expect(ability.can(action, Course)).toEqual(value);
        });
      });
    });

    describe('Course activity', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} course activities`, () => {
          expect(ability.can(action, CourseActivity)).toEqual(value);
        });
      });
    });

    describe('Schedule', () => {
      const expected = generateExpected(values(E_ACTION), [
        true,
        true,
        false,
        true,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} schedule items`, () => {
          expect(ability.can(action, Schedule)).toEqual(value);
        });
      });
    });
  });

  describe('Scheduler', () => {
    beforeEach(() => {
      user = new User();
      user[E_USER_ENTITY_KEYS.ROLES] = [
        {
          [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE.SCHEDULER,
          [E_ROLE_ENTITY_KEYS.PERMISSIONS]: [],
        },
      ];
      ability = abilityFactory.createForUser(user);
    });

    describe('Users', () => {
      const expected = generateExpected(
        values(E_ACTION),
        times(4, constant(false)),
      );

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} users`, () => {
          expect(ability.can(action, User)).toEqual(value);
        });
      });
    });

    describe('Class', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} classes`, () => {
          expect(ability.can(action, Class)).toEqual(value);
        });
      });
    });

    describe('Course', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} courses`, () => {
          expect(ability.can(action, Course)).toEqual(value);
        });
      });
    });

    describe('Course activity', () => {
      const expected = generateExpected(values(E_ACTION), [
        false,
        true,
        false,
        false,
      ]);

      map(expected, (value, action: E_ACTION) => {
        it(`Can ${action} course activities`, () => {
          expect(ability.can(action, CourseActivity)).toEqual(value);
        });
      });
    });

    describe('Schedule', () => {
      it(`Can manage schedule items`, () => {
        expect(ability.can(E_MANAGE_ACTION, Schedule)).toEqual(true);
      });
    });
  });

  describe('Admin', () => {
    beforeEach(() => {
      user = new User();
      user[E_USER_ENTITY_KEYS.ROLES] = [
        {
          [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE.ADMIN,
          [E_ROLE_ENTITY_KEYS.PERMISSIONS]: [],
        },
      ];
      ability = abilityFactory.createForUser(user);
    });

    describe('Users', () => {
      it(`Can manage users`, () => {
        expect(ability.can(E_MANAGE_ACTION, User)).toEqual(true);
      });
    });

    describe('Class', () => {
      it(`Can manage classes`, () => {
        expect(ability.can(E_MANAGE_ACTION, Class)).toEqual(true);
      });
    });

    describe('Course', () => {
      it(`Can manage courses`, () => {
        expect(ability.can(E_MANAGE_ACTION, Course)).toEqual(true);
      });
    });

    describe('Course activity', () => {
      it(`Can manage course activities`, () => {
        expect(ability.can(E_MANAGE_ACTION, CourseActivity)).toEqual(true);
      });
    });

    describe('Schedule', () => {
      it(`Can manage schedule items`, () => {
        expect(ability.can(E_MANAGE_ACTION, Schedule)).toEqual(true);
      });
    });
  });
});
