import { ref } from '@mikro-orm/core';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCMSObjectEntity } from '../entities/postgres-cms-object.entity';
import { PostgresCMSCreatableJSONAdapter } from './postgres-cms-creatable.adapter';

export type CMSObjectKeyRemap<T extends [string, string][] = []> = CMSKeyRemap<[['updatedBy', 'updatedByID'], ...T]>;

export const PostgresCMSObjectJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCMSObjectEntity>,
  ToJSONWithForeignKeys<PostgresCMSObjectEntity>
>(
  ({ updatedAt, updatedBy, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),

    ...(updatedBy !== undefined && { updatedByID: updatedBy?.id ?? null }),
  }),
  ({ updatedAt, updatedByID, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),

    ...(updatedByID !== undefined && { updatedBy: updatedByID === null ? null : ref(UserStubEntity, updatedByID) }),
  })
);
