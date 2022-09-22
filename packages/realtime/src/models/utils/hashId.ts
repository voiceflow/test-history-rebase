import { EmptyObject, Utils } from '@voiceflow/common';

import type Hashids from '@/clients/hashids';

import { KeyRemap } from './types';

export type HashIDToNumber<Model extends EmptyObject, Key extends keyof Model> = KeyRemap<Model, Key, number>;

const transformToHashIDFactory =
  <FromValue>() =>
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>, hashids: Hashids) =>
  <Model extends { [key in Key]?: FromValue }>(model: Model): KeyRemap<Model, Key, string> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (Utils.object.hasProperty(model, key) ? [[key, hashids.encode(model[key] as any)]] : []))
    ) as KeyRemap<Model, Key, string>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

const transformFromHashIDFactory =
  () =>
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>, hashids: Hashids) =>
  <Model extends { [key in Key]?: string }>(model: Model): KeyRemap<Model, Key, number> => {
    const mappedKeys = Object.fromEntries(keys.flatMap((key) => (model[key] ? [[key, hashids.decode(model[key]!)[0]]] : []))) as KeyRemap<
      Model,
      Key,
      number
    >;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const numberToHashID = transformToHashIDFactory();
export const hashIDToNumber = transformFromHashIDFactory();
