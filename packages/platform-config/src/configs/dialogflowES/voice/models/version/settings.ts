import * as Common from '@platform-config/configs/common';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';

export interface Model extends Common.Voice.Models.Version.Settings.Extends<DFESVersion.VoiceSettings, GoogleConstants.Voice> {}
