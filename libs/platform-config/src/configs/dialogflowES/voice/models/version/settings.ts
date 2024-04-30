import type { DFESVersion } from '@voiceflow/google-dfes-types';
import type { GoogleConstants } from '@voiceflow/google-types';

import type * as Common from '@/configs/common';

export interface Model
  extends Common.Voice.Models.Version.Settings.Extends<DFESVersion.VoiceSettings, GoogleConstants.Voice> {}
