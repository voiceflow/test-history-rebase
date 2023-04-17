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

export const smart = createSmartSimpleAdapter<
  VoiceflowVersion.ChatPublishing,
  Models.Version.Publishing.Model,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions
>(
  (dbPublishing, options) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.fromDB(dbPublishing, options),
    ...Config.pickNonEmptyFields(dbPublishing, PLATFORM_ONLY_FILES),
  }),
  (publishing, options) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.toDB(publishing, options),
    ...Config.pickNonEmptyFields(publishing, PLATFORM_ONLY_FILES),
  })
);

export const simple = createSimpleAdapter<
  VoiceflowVersion.ChatPublishing,
  Models.Version.Publishing.Model,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions
>(
  (dbPublishing, options) => smart.fromDB(dbPublishing, options),
  (publishing, options) => smart.toDB(publishing, options)
);

export const CONFIG = Common.Chat.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Common.Chat.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;
