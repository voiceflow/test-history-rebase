import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { EntityEntity } from '../entity.entity';
import type { EntityVariantEntity } from './entity-variant.entity';

export const EntityVariantEntityAdapter = createSmartMultiAdapter<
  EntityObject<EntityVariantEntity>,
  ToJSONWithForeignKeys<EntityVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['entity', 'entityID']]>
>(
  ({ entity, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(entity !== undefined && { entityID: entity.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(data.synonyms !== undefined && {
      synonyms: data.synonyms.map((synonym) => {
        if (synonym.toLocaleLowerCase() === '"null"') {
          return synonym.replaceAll('"', '');
        }

        return synonym;
      }),
    }),
  }),
  ({ entityID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(entityID !== undefined && {
        entity: ref(EntityEntity, { id: entityID, environmentID }),
      }),
    }),

    ...(data.synonyms !== undefined && {
      synonyms: data.synonyms.map((synonym) => {
        if (synonym.toLocaleLowerCase() === 'null') {
          return `"${synonym}"`;
        }

        return synonym;
      }),
    }),
  })
);