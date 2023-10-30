import type { Cast, Collection, IsUnknown, Primary, PrimaryKeyType, PrimaryProperty, Reference } from '@mikro-orm/core';
import type { ExcludeFunctions } from '@mikro-orm/core/typings';
import type { ObjectId } from '@mikro-orm/mongodb';

import type { Markup, ORM } from './common';
import type { UtteranceText } from './postgres/intent/utterance/utterance-text.dto';

interface AnyRecord {
  [key: string]: any;
}

export interface CMSCompositePK {
  id: string;
  environmentID: string;
}

export type EntityPKValue = string | number;

export interface PKEntity {
  id: EntityPKValue;
  [PrimaryKeyType]?: unknown;
}

export interface Relation<ID extends EntityPKValue = string> {
  id: ID;

  toJSON(): any;
}

export interface Constructor<Parameters extends any[], Instance> {
  new (...args: Parameters): Instance;
}

export type PKOrEntity<Entity extends PKEntity> = Entity | Primary<Entity>;

export interface ORMMutateOptions {
  flush?: boolean;
}

export interface ORMDeleteOptions extends ORMMutateOptions {}

export type ORMParam<T> = T extends ORM<any, infer Param> ? Param : never;

export type ORMEntity<T> = T extends { _entity?: infer Entity } ? Entity : never;

export type RelationKeys<T> = keyof {
  [K in keyof T as Exclude<T[K], null | undefined> extends Relation<EntityPKValue> ? K : never]: true;
};

export type CollectionKeys<T> = keyof {
  [K in keyof T as Exclude<T[K], null | undefined> extends Collection<any, any> ? K : never]: true;
};

export type ToForeignKeys<T extends AnyRecord> = Omit<T, RelationKeys<T>> & {
  [K in RelationKeys<T> as `${K & string}ID`]: T[K] extends Relation<EntityPKValue>
    ? T[K]['id']
    : T[K] extends Relation<EntityPKValue> | null
    ? NonNullable<T[K]>['id'] | null
    : T[K]['id'];
};

export type ResolvedForeignKeys<T extends AnyRecord, D extends AnyRecord> = {
  [K in Exclude<keyof D, typeof PrimaryKeyType> as K extends `${keyof T & string}ID`
    ? K extends `${infer TK}ID`
      ? TK
      : K
    : K]: K extends `${keyof T & string}ID` ? (K extends `${infer TK}ID` ? T[TK] : D[K]) : D[K];
};

export type OmitCollections<T> = Omit<T, CollectionKeys<T>>;

export type ResolveForeignKeysParams<T> = Partial<
  ToForeignKeys<Omit<OmitCollections<T>, 'id' | '_id' | 'createdAt' | 'toJSON' | 'wrap' | typeof PrimaryKeyType>>
>;

export type MutableEntityData<T extends AnyRecord> = Partial<Omit<ToJSONWithForeignKeys<T>, 'updatedAt'>>;

export type ExcludeCreateKeys =
  | 'id'
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'toJSON'
  | 'wrap'
  | typeof PrimaryKeyType;

export type EntityCreateParams<T, K extends keyof T = never> = ToJSON<
  ToForeignKeys<Omit<OmitCollections<T>, ExcludeCreateKeys | K>> & Partial<Pick<T, keyof T & ('id' | '_id')>>
>;

export type ValidKeys<T, PK> = {
  [K in keyof PK]: K extends keyof T ? K : never;
}[keyof PK];

export type Ref<T, PK extends keyof T | unknown = PrimaryProperty<T>> = true extends IsUnknown<PK>
  ? Reference<T>
  : // check if PK is a object or record
  T extends { [PrimaryKeyType]?: infer K }
  ? K & Reference<T>
  : {
      [K in Cast<PK, keyof T>]: T[K];
    } & Reference<T>;

export type WithAdditionalProperties<T extends AnyRecord> = AnyRecord & T;

export type JSONRemap<RemapType, Type> = RemapType | Exclude<Type, NonNullable<Type>>;

export type JSONStringRemapTypes = ObjectId | Date;

export type JSONTypeRemap<Type> = Type extends JSONStringRemapTypes
  ? JSONRemap<string, Type>
  : Type extends Markup
  ? Type
  : Type extends UtteranceText
  ? Type
  : Type extends Array<infer Item>
  ? { [key in keyof Type]: JSONTypeRemap<Item> }
  : Type extends object
  ? ToJSON<Type>
  : Type;

export type EntityObject<Type> = {
  [Key in keyof Type as Exclude<ExcludeFunctions<Type, Key>, CollectionKeys<Type>>]: Type[Key];
};

export type ToJSON<Type> = {
  [Key in keyof Type as Exclude<ExcludeFunctions<Type, Key>, CollectionKeys<Type>>]: JSONTypeRemap<Type[Key]>;
};

export type ToJSONWithForeignKeys<Type extends AnyRecord> = ToJSON<ToForeignKeys<OmitCollections<Type>>>;

export type CMSKeyRemap<T extends [string, string][] = []> = [['assistant', 'assistantID'], ...T];
