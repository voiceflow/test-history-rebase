import * as Common from '@platform-config/configs/common';
import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';

export interface Model extends Common.Voice.Models.Version.Settings.Extends<AlexaVersion.Settings, AlexaConstants.Voice> {}
