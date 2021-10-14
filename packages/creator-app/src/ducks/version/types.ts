import { AnyVersion } from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crud';

export type {
  AlexaVersion,
  AnyLocale,
  AnyVersion,
  AnyVersionPlatformData,
  AnyVersionPublishing,
  AnyVersionSettings,
  AnyVoice,
  DialogflowVersion,
  GeneralVersion,
  GoogleVersion,
} from '@voiceflow/realtime-sdk';

export type VersionState = CRUDState<AnyVersion>;
