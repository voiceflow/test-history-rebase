import type { Cast, Collection, IsUnknown, Primary, PrimaryKeyProp, PrimaryProperty, Reference } from '@mikro-orm/core';
import type { CleanKeys } from '@mikro-orm/core/typings';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord, Struct } from '@voiceflow/common';
import type { Markup } from '@voiceflow/dtos';

import type { UtteranceText } from './postgres/intent/utterance/utterance-text.dto';

export const DEFAULT_OR_NULL_COLUMN = Symbol('DEFAULT_OR_NULL_COLUMN');

export type ExtendDefaultColumns<Entity, Key extends string> =
  | (Entity extends { [DEFAULT_OR_NULL_COLUMN]?: infer C } ? C : never)
  | Key;

export interface CMSCompositePK {
  id: string;
  environmentID: string;
}

export type PostgresEntityPKValue = string | number;

export interface BasePKEntity {
  id?: PostgresEntityPKValue;

  _id?: ObjectId;

  [DEFAULT_OR_NULL_COLUMN]?: unknown;
}

export interface PostgresPKEntity extends Omit<BasePKEntity, '_id'> {
  id: PostgresEntityPKValue;

  [PrimaryKeyProp]?: unknown;
}

export interface MongoPKEntity extends Omit<BasePKEntity, 'id'> {
  _id: ObjectId;
}

export interface Constructor<Instance, Args extends any[] = []> {
  new (...args: Args): Instance;
}

export type DefaultColumnsToJSON<Entity> = Entity extends { [DEFAULT_OR_NULL_COLUMN]?: infer D }
  ? keyof {
      [Key in D as Key extends string
        ? NonNullable<Entity[Key & keyof Entity]> extends Ref<any>
          ? `${Key}ID`
          : Key
        : never]: true;
    }
  : never;

export type PatchData<Entity extends BasePKEntity> = Partial<ToObject<Entity>>;

export type CreateData<Entity extends BasePKEntity> = Omit<ToObject<Entity>, DefaultColumnsToJSON<Entity>> &
  Partial<Pick<ToObject<Entity>, DefaultColumnsToJSON<Entity>>>;

export type WhereData<Entity extends AnyRecord, EntityData = ToObject<Entity>> = {
  [Key in keyof EntityData]?: EntityData[Key] | EntityData[Key][];
};

export type OrderByData<Entity extends AnyRecord, EntityData = ToObject<Entity>> = {
  [Key in keyof EntityData]?: 'asc' | 'desc';
};

export type ORMEntity<ORM> = ORM extends { Entity: Constructor<infer Entity> } ? Entity : never;

export type ORMDiscriminatorEntity<ORM> = ORM extends { DiscriminatorEntity?: infer Entity } ? Entity : never;

export type RelationKeys<T> = keyof {
  [K in keyof T as NonNullable<T[K]> extends Ref<any> ? K : never]: true;
};

export type CollectionKeys<T> = keyof {
  [K in keyof T as NonNullable<T[K]> extends Collection<any, any> ? K : never]: true;
};

export type VirtualKeys<T> = keyof {
  [K in keyof T as NonNullable<T[K]> extends Collection<any, any> ? K : never]: true;
};

export type ToForeignKeys<T extends AnyRecord> = {
  [K in keyof T as K extends RelationKeys<T> ? `${K & string}ID` : K]: T[K] extends Ref<any>
    ? T[K]['id']
    : T[K] extends Ref<any> | null
      ? NonNullable<T[K]>['id'] | null
      : T[K];
};

export type ResolvedForeignKeys<T extends AnyRecord, D extends AnyRecord> = {
  [K in Exclude<keyof D, typeof PrimaryKeyProp> as K extends `${keyof T & string}ID`
    ? K extends `${infer TK}ID`
      ? TK
      : K
    : K]: K extends `${keyof T & string}ID` ? (K extends `${infer TK}ID` ? T[TK] : D[K]) : D[K];
};

export type OmitCollections<T> = Omit<T, CollectionKeys<T>>;

export type ExcludeCreateKeys =
  | 'id'
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'toJSON'
  | typeof PrimaryKeyProp;

export type Ref<T extends object, PK extends keyof T | unknown = PrimaryProperty<T>> =
  true extends IsUnknown<PK>
    ? Reference<T>
    : // check if PK is a object or record
      T extends { [PrimaryKeyProp]?: infer K }
      ? K & Reference<T>
      : {
          [K in Cast<PK, keyof T>]: T[K];
        } & Reference<T>;

export type WithAdditionalProperties<T extends AnyRecord> = T & Struct;

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

export type ToObject<Type extends AnyRecord> = ToForeignKeys<{
  [Key in keyof Type as Exclude<CleanKeys<Type, Key>, CollectionKeys<Type>>]: Type[Key];
}>;

export type ToJSON<Type> = {
  [Key in keyof Type as Exclude<CleanKeys<Type, Key>, CollectionKeys<Type>>]: JSONTypeRemap<Type[Key]>;
};

export type PrimaryObject<Entity extends BasePKEntity> =
  Primary<Entity> extends string
    ? Entity extends { _id: ObjectId }
      ? { _id: ObjectId }
      : { id: string }
    : Primary<Entity>;
