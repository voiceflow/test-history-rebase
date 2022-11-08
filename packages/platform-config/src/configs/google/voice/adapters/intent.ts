import * as Common from '@platform-config/configs/common';
import { GoogleConstants } from '@voiceflow/google-types';

export const smart = Common.Voice.Adapters.Intent.smartFactory<GoogleConstants.Voice>();

export const simple = Common.Voice.Adapters.Intent.simpleFactory<GoogleConstants.Voice>();
