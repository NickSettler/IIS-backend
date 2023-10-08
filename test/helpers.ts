import { forEach, omit, sortBy } from 'lodash';

export const expectWithoutNested = <Entity extends Record<PropertyKey, any>>(
  actual: Entity,
  expected: Entity,
  nestedKeys: Array<keyof Entity>,
) => {
  const pureActual = omit(actual, nestedKeys);
  const pureExpected = omit(expected, nestedKeys);

  expect(pureActual).toEqual(pureExpected);
};

export const expectOnlyNested = <Entity extends Record<PropertyKey, any>>(
  actual: Partial<Entity>,
  expected: Partial<Entity>,
  nestedMap: Partial<Record<keyof Entity, PropertyKey>>,
) => {
  forEach(nestedMap, (nestedKey, entityKey) => {
    const actualArray = sortBy(actual[entityKey], nestedKey);
    const expectedArray = sortBy(expected[entityKey], nestedKey);

    expect(actualArray).toEqual(expectedArray);
  });
};
