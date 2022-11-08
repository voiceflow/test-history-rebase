import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSmartSimpleAdapter } from 'bidirectional-adapter';

const PLATFORM_ONLY_FILES = Types.satisfies<keyof VoiceflowVersion.BaseSettings>()(['locales']);

export const smart = createSmartSimpleAdapter<VoiceflowVersion.BaseSettings, Pick<VoiceflowVersion.BaseSettings, typeof PLATFORM_ONLY_FILES[number]>>(
  (dbPublishing) => Config.pickNonEmptyFields(dbPublishing, PLATFORM_ONLY_FILES),
  (publishing) => Config.pickNonEmptyFields(publishing, PLATFORM_ONLY_FILES)
);
