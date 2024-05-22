/* eslint-disable no-param-reassign */

import { entityToLegacySlot, intentToLegacyIntent } from '@realtime-sdk/adapters';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import uniqBy from 'lodash/uniqBy';

import { Transform } from './types';

// migrates project to assistant, migrates platform data slots and intents to cms resources
const migrateToV5_00: Transform = ({ cms, version }, { project, creatorID }) => {
  const createdAt = new Date().toJSON();
  const platformConfig = Platform.Config.get(project.platform);

  cms.assistant = {
    id: project.id,
    name: project.name,
    createdAt,
    updatedAt: createdAt,
    updatedByID: creatorID,
    workspaceID: project.workspaceID,
    activeEnvironmentID: project.versionID,
  };

  ({ entities: cms.entities, entityVariants: cms.entityVariants } = entityToLegacySlot.mapToDB(
    uniqBy(version.platformData.slots, (slot) => slot.key),
    {
      creatorID,
      assistantID: project.id,
      environmentID: project.versionID,
    }
  ));

  const versionIntents = [...version.platformData.intents];

  if (platformConfig.isVoiceflowBased && !versionIntents.some((intent) => intent.key === VoiceflowConstants.IntentName.NONE)) {
    versionIntents.push({ key: VoiceflowConstants.IntentName.NONE, name: VoiceflowConstants.IntentName.NONE, inputs: [] });
  }

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
      intents: uniqBy(versionIntents, (intent) => intent.key),
    },
    {
      creatorID,
      assistantID: project.id,
      legacySlots: version.platformData.slots,
      environmentID: project.versionID,
    }
  ));
};

export default migrateToV5_00;
