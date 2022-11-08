import * as Common from '@platform-config/configs/common';
import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

// TODO: move to webchat platform when removed from voiceflow types
const PLATFORM_ONLY_FILES = Types.satisfies<keyof VoiceflowVersion.ChatPublishing>()([
  'title',
  'image',
  'color',
  'avatar',
  'spacing',
  'launcher',
  'position',
  'watermark',
  'persistence',
  'description',
]);

export const smart = createSmartSimpleAdapter<VoiceflowVersion.ChatPublishing, Models.Version.Publishing.Model>(
  (dbPublishing) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
    ...Config.pickNonEmptyFields(dbPublishing, PLATFORM_ONLY_FILES),
  }),
  (publishing) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.toDB(publishing),
    ...Config.pickNonEmptyFields(publishing, PLATFORM_ONLY_FILES),
  })
);

export const simple = createSimpleAdapter<VoiceflowVersion.ChatPublishing, Models.Version.Publishing.Model>(
  (dbPublishing) => smart.fromDB(dbPublishing),
  (publishing) => smart.toDB(publishing)
);
