import type { EmptyObject } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { Double, ObjectId } from 'bson';

import type { KeyRemap } from './types';

export type StringToDate<Model extends EmptyObject, Key extends keyof Model> = KeyRemap<Model, Key, Date>;

export type NumberToDouble<Model extends EmptyObject, Key extends keyof Model> = KeyRemap<Model, Key, Double>;

export type StringToObjectID<Model extends EmptyObject, Key extends keyof Model> = KeyRemap<Model, Key, ObjectId>;

const transformToBsonTypeFactory =
  <FromValue, ToClass extends typeof Double | typeof ObjectId | typeof Date>(Class: ToClass) =>
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>) =>
  <Model extends { [key in Key]?: FromValue }>(model: Model): KeyRemap<Model, Key, InstanceType<ToClass>> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (Utils.object.hasProperty(model, key) ? [[key, new Class(model[key] as any)]] : []))
    ) as KeyRemap<Model, Key, InstanceType<ToClass>>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

const transformFromBsonTypeFactory =
  <ToValue, FromClass extends Double | ObjectId | Date>() =>
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>) =>
  <Model extends { [key in Key]?: FromClass }>(model: Model): KeyRemap<Model, Key, ToValue> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => {
        if (!Utils.object.hasProperty(model, key)) return [];
        const value = model[key];

        return [value?.toJSON ? [key, value.toJSON()] : [key, value]];
      })
    ) as KeyRemap<Model, Key, ToValue>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const stringToDate = transformToBsonTypeFactory<string, typeof Date>(Date);
export const dateToString = transformFromBsonTypeFactory<string, Date>();
export const numberToDouble = transformToBsonTypeFactory<number, typeof Double>(Double);
export const doubleToNumber = transformFromBsonTypeFactory<number, Double>();
export const stringToObjectId = transformToBsonTypeFactory<string, typeof ObjectId>(ObjectId);
export const objectIdToString = transformFromBsonTypeFactory<string, ObjectId>();
