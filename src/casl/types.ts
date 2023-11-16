/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars */

import { AnyAbility } from '@casl/ability/dist/types/PureAbility';
import {
  AbilityTuple,
  AnyClass,
  AnyObject,
  ExtractSubjectType as E,
  Normalize,
  SubjectType,
  TaggedInterface,
} from '@casl/ability/dist/types/types';
import { Generics, RawRuleOf } from '@casl/ability/dist/types/RuleIndex';
import { ProduceGeneric } from '@casl/ability/dist/types/hkt';

declare class RuleBuilder<T extends AnyAbility> {
  _rule: RawRuleOf<T>;
  constructor(rule: RawRuleOf<T>);
  public because(reason: string): this;
}

export type AbilityFactory<T extends AnyAbility> =
  | AnyClass<T>
  | ((rules?: Array<any>, options?: any) => T);

export type InstanceOf<
  T extends AnyAbility,
  S extends SubjectType,
> = S extends AnyClass<infer R>
  ? R
  : S extends (...args: Array<any>) => infer O
    ? O
    : S extends string
      ? Exclude<
          Normalize<Generics<T>['abilities']>[1],
          SubjectType
        > extends TaggedInterface<string>
        ? Extract<Normalize<Generics<T>['abilities']>[1], TaggedInterface<S>>
        : AnyObject
      : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type ConditionsOf<T extends AnyAbility, I extends {}> = ProduceGeneric<
  Generics<T>['conditions'],
  I
>;
export type ActionFrom<
  T extends AbilityTuple,
  S extends SubjectType,
> = T extends any
  ? S extends Extract<T[1], SubjectType>
    ? T[0]
    : never
  : never;
export type ActionOf<T extends AnyAbility, S extends SubjectType> = ActionFrom<
  Generics<T>['abilities'],
  S
>;
export type SubjectTypeOf<T extends AnyAbility> = E<
  Normalize<Generics<T>['abilities']>[1]
>;
export type SimpleCanParams<T extends AnyAbility> = Parameters<
  (action: Array<Generics<T>['abilities']> | Generics<T>['abilities']) => 0
>;
export type BuilderCanParameters<
  S extends SubjectType,
  I extends InstanceOf<T, S>,
  T extends AnyAbility,
> = Generics<T>['abilities'] extends AbilityTuple
  ? Parameters<
      (
        action: ActionOf<T, S> | Array<ActionOf<T, S>>,
        subject: Array<S> | S,
        conditions?: ConditionsOf<T, I>,
      ) => 0
    >
  : SimpleCanParams<T>;
export type BuilderCanParametersWithFields<
  S extends SubjectType,
  I extends InstanceOf<T, S>,
  F extends string,
  T extends AnyAbility,
> = Generics<T>['abilities'] extends AbilityTuple
  ? Parameters<
      (
        action: ActionOf<T, S> | Array<ActionOf<T, S>>,
        subject: Array<S> | S,
        fields?: Array<F> | F,
        conditions?: ConditionsOf<T, I>,
      ) => 0
    >
  : SimpleCanParams<T>;
export type Keys<T> = string & keyof T;
export type AddRule<T extends AnyAbility> = {
  <
    I extends InstanceOf<T, S>,
    F extends string = Keys<I>,
    S extends SubjectTypeOf<T> = SubjectTypeOf<T>,
  >(
    ...args: BuilderCanParametersWithFields<S, I, F | Keys<I>, T>
  ): RuleBuilder<T>;
  <I extends InstanceOf<T, S>, S extends SubjectTypeOf<T> = SubjectTypeOf<T>>(
    ...args: BuilderCanParameters<S, I, T>
  ): RuleBuilder<T>;
};
