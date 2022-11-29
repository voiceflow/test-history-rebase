import * as Common from '@platform-config/configs/common';
import * as Google from '@platform-config/configs/google';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as DialogflowESCommon from '../../../common';
import * as Models from '../../models';

type KeyRemap = [['agentName', 'invocationName'], ['triggerPhrase', 'invocationNameSamples']];

export const smart = createSmartSimpleAdapter<
  DFESVersion.ChatPublishing,
  Models.Version.Publishing.Model,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions,
  KeyRemap
>(
  (dbPublishing, options) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.fromDB(dbPublishing, options),
    ...Google.Common.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
    ...DialogflowESCommon.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
  }),
  (publishing, options) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.toDB(publishing, options),
    ...Google.Common.Adapters.Version.Publishing.smart.toDB(publishing),
    ...DialogflowESCommon.Adapters.Version.Publishing.smart.toDB(publishing),
  })
);

export const simple = createSimpleAdapter<
  DFESVersion.ChatPublishing,
  Models.Version.Publishing.Model,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Publishing.FromAndToDBOptions
>(
  (dbPublishing, options) => smart.fromDB(DFESVersion.defaultChatPublishing(dbPublishing), options),
  (publishing, options) => smart.toDB(publishing, options)
);

export const CONFIG = Common.Chat.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Common.Chat.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;
