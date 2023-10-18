import { forEach, isArray, map, omit, sortBy } from 'lodash';

export function expectWithoutNested<Entity extends Record<PropertyKey, any>>(
  actual: Entity,
  expected: Entity,
  nestedKeys: Array<keyof Entity>,
): void;
export function expectWithoutNested<Entity extends Record<PropertyKey, any>>(
  actual: Array<Entity>,
  expected: Array<Entity>,
  nestedKeys: Array<keyof Entity>,
): void;
export function expectWithoutNested<Entity extends Record<PropertyKey, any>>(
  actual: Array<Entity> | Entity,
  expected: Array<Entity> | Entity,
  nestedKeys: Array<keyof Entity>,
): void {
  const pureActual = isArray(actual)
    ? map(actual, (item) => omit(item, nestedKeys))
    : omit(actual, nestedKeys);
  const pureExpected = isArray(expected)
    ? map(expected, (item) => omit(item, nestedKeys))
    : omit(expected, nestedKeys);

  expect(pureActual).toEqual(pureExpected);
}

export function expectOnlyNested<Entity extends Record<PropertyKey, any>>(
  actual: Partial<Entity>,
  expected: Partial<Entity>,
  nestedMap: Partial<Record<keyof Entity, PropertyKey>>,
): void;
export function expectOnlyNested<Entity extends Record<PropertyKey, any>>(
  actual: Partial<Array<Entity>>,
  expected: Partial<Array<Entity>>,
  nestedMap: Partial<Record<keyof Entity, PropertyKey>>,
): void;
export function expectOnlyNested<Entity extends Record<PropertyKey, any>>(
  actual: Partial<Array<Entity>> | Partial<Entity>,
  expected: Partial<Array<Entity>> | Partial<Entity>,
  nestedMap: Partial<Record<keyof Entity, PropertyKey>>,
) {
  forEach(nestedMap, (nestedKey, entityKey) => {
    const actualArray = isArray(actual)
      ? map(actual, (item) => sortBy(item[entityKey], nestedKey))
      : sortBy(actual[entityKey], nestedKey);
    const expectedArray = isArray(expected)
      ? map(expected, (item) => sortBy(item[entityKey], nestedKey))
      : sortBy(expected[entityKey], nestedKey);

    expect(actualArray).toEqual(expectedArray);
  });
}
