import type * as Common from '@platform-config/configs/common';
import type { DFESVersion } from '@voiceflow/google-dfes-types';
import type { GoogleConstants } from '@voiceflow/google-types';

export interface Model
  extends Common.Voice.Models.Version.Settings.Extends<DFESVersion.VoiceSettings, GoogleConstants.Voice> {}
