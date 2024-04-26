import type * as Common from '@platform-config/configs/common';
import type { GoogleConstants } from '@voiceflow/google-types';

export interface Model extends Common.Voice.Models.Intent.Model<GoogleConstants.Voice> {}
