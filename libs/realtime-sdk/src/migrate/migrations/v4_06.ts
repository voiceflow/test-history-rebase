import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { Transform } from './types';

// add none intent to all VFNLU projects
const migrateToV4_06: Transform = ({ version }, { platform }) => {
  const VFNLU_PLATFORMS = new Set<string>([
    VoiceflowConstants.PlatformType.VOICEFLOW,
    VoiceflowConstants.PlatformType.WEBCHAT,
    VoiceflowConstants.PlatformType.SMS,
    VoiceflowConstants.PlatformType.MICROSOFT_TEAMS,
    VoiceflowConstants.PlatformType.WHATSAPP,
  ]);

  if (!VFNLU_PLATFORMS.has(platform)) return;

  if (version.platformData.intents?.some((intent) => intent.key === VoiceflowConstants.IntentName.NONE)) return;

  version.platformData.intents?.push({
    key: VoiceflowConstants.IntentName.NONE,
    name: VoiceflowConstants.IntentName.NONE,
    inputs: [],
    slots: [],
  });
};

export default migrateToV4_06;
