import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PersonaEntity } from '../persona.entity';
import type { PersonaOverrideEntity } from './persona-override.entity';

export const PersonaOverrideJSONAdapter = createSmartMultiAdapter<
  EntityObject<PersonaOverrideEntity>,
  ToJSONWithForeignKeys<PersonaOverrideEntity>,
  [],
  [],
  CMSKeyRemap<[['persona', 'personaID']]>
>(
  ({ persona, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(persona !== undefined && { personaID: persona.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ personaID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(personaID !== undefined && {
        persona: ref(PersonaEntity, { id: personaID, environmentID }),
      }),
    }),
  })
);
