import type { EmptyObject } from '@voiceflow/common';

import type { KeyRemap } from './types';

export const toDB =
  <Key extends string, DBModel extends EmptyObject, Model extends EmptyObject>(
    keys: Key[] | ReadonlyArray<Key>,
    adapter: { toDB: (model: Model) => DBModel }
  ) =>
  <BaseModel extends { [key in Key]?: Model }>(model: BaseModel): KeyRemap<BaseModel, Key, DBModel> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (key in model ? [[key, adapter.toDB(model[key]!)]] : []))
    ) as KeyRemap<BaseModel, Key, DBModel>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const mapToDB =
  <Key extends string, DBModel extends EmptyObject, Model extends EmptyObject>(
    keys: Key[] | ReadonlyArray<Key>,
    adapter: { mapToDB: (model: Model[]) => DBModel[] }
  ) =>
  <BaseModel extends { [key in Key]?: Model[] }>(model: BaseModel): KeyRemap<BaseModel, Key, DBModel[]> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (key in model ? [[key, adapter.mapToDB(model[key]!)]] : []))
    ) as KeyRemap<BaseModel, Key, DBModel[]>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const fromDB =
  <Key extends string, Model extends EmptyObject, DBModel extends EmptyObject>(
    keys: Key[] | ReadonlyArray<Key>,
    adapter: { fromDB: (model: DBModel) => Model }
  ) =>
  <BaseModel extends { [key in Key]?: DBModel }>(model: BaseModel): KeyRemap<BaseModel, Key, Model> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (key in model ? [[key, adapter.fromDB(model[key]!)]] : []))
    ) as KeyRemap<BaseModel, Key, Model>;

    return {
      ...model,
      ...mappedKeys,
    };
  };

export const mapFromDB =
  <Key extends string, Model extends EmptyObject, DBModel extends EmptyObject>(
    keys: Key[] | ReadonlyArray<Key>,
    adapter: { mapFromDB: (model: DBModel[]) => Model[] }
  ) =>
  <BaseModel extends { [key in Key]?: DBModel[] }>(model: BaseModel): KeyRemap<BaseModel, Key, Model[]> => {
    const mappedKeys = Object.fromEntries(
      keys.flatMap((key) => (key in model ? [[key, adapter.mapFromDB(model[key]!)]] : []))
    ) as KeyRemap<BaseModel, Key, Model[]>;

    return {
      ...model,
      ...mappedKeys,
    };
  };
