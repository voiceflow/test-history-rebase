import * as Common from '@platform-config/configs/common';
import * as Google from '@platform-config/configs/google';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as DialogflowESCommon from '../../../common';
import * as Models from '../../models';

type KeyRemap = [['agentName', 'invocationName'], ['triggerPhrase', 'invocationNameSamples']];

export const smart = createSmartSimpleAdapter<DFESVersion.ChatPublishing, Models.Version.Publishing.Model, [], [], KeyRemap>(
  (dbPublishing) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
    ...Google.Common.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
    ...DialogflowESCommon.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
  }),
  (publishing) => ({
    ...Common.Chat.Adapters.Version.Publishing.smart.toDB(publishing),
    ...Google.Common.Adapters.Version.Publishing.smart.toDB(publishing),
    ...DialogflowESCommon.Adapters.Version.Publishing.smart.toDB(publishing),
  })
);

export const simple = createSimpleAdapter<DFESVersion.ChatPublishing, Models.Version.Publishing.Model>(
  (dbPublishing) => smart.fromDB(DFESVersion.defaultChatPublishing(dbPublishing)),
  (publishing) => smart.toDB(publishing)
);
