import type { EntityPKValue, Relation, RelationKeys } from '@voiceflow/orm-designer';

export type OptionalForeignKeys<T extends { [key: string]: any }> = Omit<T, RelationKeys<T>> & {
  [K in RelationKeys<T> as `${K & string}ID`]?: Exclude<T[K], undefined> extends Relation<EntityPKValue>
    ? NonNullable<T[K]>['id']
    : Exclude<T[K], undefined> extends Relation<EntityPKValue> | null
    ? NonNullable<T[K]>['id'] | null
    : T[K]['id'];
};

export type CreateOneData<T extends { createOne: (data: any) => any }> = Parameters<T['createOne']>[0];
export type CreateManyData<T extends { createMany: (data: any[]) => any }> = Parameters<T['createMany']>[0];
export type CreateManyDataItem<T extends { createMany: (data: any[]) => any }> = CreateManyData<T>[number];
export type CreateOneForUserData<T extends { createOneForUser: (userID: number, data: any) => any }> = Parameters<T['createOneForUser']>[1];
export type CreateManyForUserData<T extends { createManyForUser: (userID: number, data: any[]) => any }> = Parameters<T['createManyForUser']>[1];

export type PatchOneData<T extends { patchOne: (id: any, data: any) => any }> = Parameters<T['patchOne']>[1];
export type PatchManyData<T extends { patchMany: (ids: any[], data: any) => any }> = Parameters<T['patchMany']>[1];
export type UpsertOneData<T extends { upsertOne: (data: any) => any }> = Parameters<T['upsertOne']>[0];
export type UpsertManyData<T extends { upsertMany: (data: any[]) => any }> = Parameters<T['upsertMany']>[0];
export type PatchManyDataItem<T extends { patchMany: (ids: any[], data: any) => any }> = PatchManyData<T>[number];
export type PatchOneForUserData<T extends { patchOneForUser: (userID: number, id: any, data: any) => any }> = Parameters<T['patchOneForUser']>[2];
export type PatchManyForUserData<T extends { patchManyForUser: (userID: number, id: any, data: any[]) => any }> = Parameters<
  T['patchManyForUser']
>[2];
