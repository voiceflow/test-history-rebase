import type { ArrayItem } from '@voiceflow/ui';
import type { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSmartSimpleAdapter } from 'bidirectional-adapter';

import { Config } from '@/configs/utils';
import { Types } from '@/utils';

const PLATFORM_ONLY_FILES = Types.satisfies<keyof VoiceflowVersion.BaseSettings>()(['locales']);

export const smart = createSmartSimpleAdapter<
  VoiceflowVersion.BaseSettings,
  Pick<VoiceflowVersion.BaseSettings, ArrayItem<typeof PLATFORM_ONLY_FILES>>
>(
  (dbPublishing) => Config.pickNonEmptyFields(dbPublishing, PLATFORM_ONLY_FILES),
  (publishing) => Config.pickNonEmptyFields(publishing, PLATFORM_ONLY_FILES)
);
