import * as Common from '@platform/configs/common';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';

export interface Session extends Common.Voice.Models.Version.Session {}

export interface Model extends Common.Voice.Models.Version.Model {
  status: Nullable<AlexaVersion.PlatformData['status']>;
  settings: Omit<AlexaVersion.Settings, 'session'>;
  publishing: AlexaVersion.Publishing;
}
