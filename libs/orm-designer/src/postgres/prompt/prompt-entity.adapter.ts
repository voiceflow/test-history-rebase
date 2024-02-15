import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularEntityAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PersonaOverrideEntity } from '../persona';
import type { PromptEntity } from './prompt.entity';

export const PromptEntityAdapter = createSmartMultiAdapter<
  EntityObject<PromptEntity>,
  ToJSONWithForeignKeys<PromptEntity>,
  [],
  [],
  CMSTabularKeyRemap<[['persona', 'personaID']]>
>(
  ({ persona, ...data }) => ({
    ...PostgresCMSTabularEntityAdapter.fromDB(data),

    ...(persona !== undefined && { personaID: persona?.id ?? null }),
  }),
  ({ personaID, ...data }) => ({
    ...PostgresCMSTabularEntityAdapter.toDB(data),

    ...(personaID !== undefined &&
      data.environmentID !== undefined && {
        persona: personaID ? ref(PersonaOverrideEntity, { id: personaID, environmentID: data.environmentID }) : null,
      }),
  })
);
