import type { EmptyObject } from '@voiceflow/common';

import type Hashids from '@/legacy/clients/hashids';

import type { KeyRemap } from './types';

export type HashIDToNumber<Model extends EmptyObject, Key extends keyof Model> = KeyRemap<Model, Key, number>;

export const numberToHashID =
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>, hashids: Hashids) =>
  <Model extends { [key in Key]?: number }>(model: Model): KeyRemap<Model, Key, string> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (key in model ? [[key, hashids.encode(model[key]!)]] : []))
    ) as KeyRemap<Model, Key, string>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const hashIDToNumber =
  <Key extends string>(keys: Key[] | ReadonlyArray<Key>, hashids: Hashids) =>
  <Model extends { [key in Key]?: string }>(model: Model): KeyRemap<Model, Key, number> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (model[key] ? [[key, hashids.decode(model[key]!)[0]]] : []))
    ) as KeyRemap<Model, Key, number>;

    return {
      ...model,
      ...mappedKeys,
    };
  };
