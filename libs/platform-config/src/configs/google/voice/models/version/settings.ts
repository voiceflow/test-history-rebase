import type { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';

import type * as Common from '@/configs/common';

export interface Model
  extends Common.Voice.Models.Version.Settings.Extends<GoogleVersion.VoiceSettings, GoogleConstants.Voice> {}
