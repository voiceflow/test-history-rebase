import * as Common from '@platform-config/configs/common';
import { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';

export interface Model extends Common.Voice.Models.Version.Settings.Extends<GoogleVersion.VoiceSettings, GoogleConstants.Voice> {}
