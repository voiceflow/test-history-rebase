/* eslint-disable no-param-reassign */

import { entityToLegacySlot, intentToLegacyIntent } from '@realtime-sdk/adapters';
import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';

// migrates project to assistant, migrates platform data slots and intents to cms resources
const migrateToV5_00: Transform = ({ cms, version }, { project, creatorID }) => {
  const createdAt = new Date().toJSON();

  cms.assistant = {
    id: project.id,
    name: project.name,
    createdAt,
    updatedAt: createdAt,
    workspaceID: project.workspaceID,
    activePersonaID: null,
    activeEnvironmentID: project.versionID,
  };

  ({ entities: cms.entities, entityVariants: cms.entityVariants } = entityToLegacySlot.mapToDB(version.platformData.slots, {
    creatorID,
    assistantID: project.id,
    environmentID: project.versionID,
  }));

  ({
    intents: cms.intents,
    responses: cms.responses,
    utterances: cms.utterances,
    responseVariants: cms.responseVariants,
    requiredEntities: cms.requiredEntities,
    responseDiscriminators: cms.responseDiscriminators,
  } = intentToLegacyIntent.mapToDB(
    {
      notes: Object.values(version.notes ?? {}).filter((note): note is BaseModels.IntentNote => note.type === BaseModels.NoteType.INTENT),
      intents: version.platformData.intents,
    },
    {
      creatorID,
      assistantID: project.id,
      environmentID: project.versionID,
    }
  ));
};

export default migrateToV5_00;
