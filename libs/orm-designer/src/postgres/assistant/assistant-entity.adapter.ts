import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectEntityAdapter } from '@/postgres/common/adapters/postgres-cms-object-entity.adapter';
import { ref } from '@/postgres/common/ref.util';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PersonaEntity } from '../persona/persona.entity';
import { WorkspaceStubEntity } from '../stubs/workspace.stub';
import type { AssistantEntity } from './assistant.entity';

export const AssistantEntityAdapter = createSmartMultiAdapter<
  EntityObject<AssistantEntity>,
  ToJSONWithForeignKeys<AssistantEntity>,
  [],
  [],
  [['workspace', 'workspaceID'], ['activePersona', 'activePersonaID']]
>(
  ({ workspace, activePersona, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(workspace !== undefined && { workspaceID: workspace.id }),

    ...(activePersona !== undefined && { activePersonaID: activePersona?.id ?? null }),
  }),
  ({ workspaceID, activePersonaID, activeEnvironmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(workspaceID !== undefined && { workspace: ref(WorkspaceStubEntity, workspaceID) }),

    ...(activeEnvironmentID !== undefined && {
      activeEnvironmentID,

      ...(activePersonaID !== undefined && {
        activePersona: activePersonaID
          ? ref(PersonaEntity, { id: activePersonaID, environmentID: activeEnvironmentID })
          : null,
      }),
    }),
  })
);
