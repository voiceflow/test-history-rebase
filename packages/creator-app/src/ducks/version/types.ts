import { AnyVersion } from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crud';

export type {
  AlexaVersion,
  AnyLocale,
  AnyPlatformData,
  AnyPublishing,
  AnySettings,
  AnyVersion,
  AnyVoice,
  GeneralVersion,
  GoogleVersion,
} from '@voiceflow/realtime-sdk';

export type VersionState = CRUDState<AnyVersion>;
