import * as Common from '@platform-config/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';

export const simple = Common.Voice.Adapters.Version.Session.simpleFactory<AlexaConstants.Voice>();
