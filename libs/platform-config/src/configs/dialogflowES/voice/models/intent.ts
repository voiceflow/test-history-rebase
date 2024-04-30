import type { GoogleConstants } from '@voiceflow/google-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Voice.Models.Intent.Model<GoogleConstants.Voice> {}
