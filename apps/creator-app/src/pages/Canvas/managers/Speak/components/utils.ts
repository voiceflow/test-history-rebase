import * as Realtime from '@voiceflow/realtime-sdk';

import { DialogType } from '@/constants';

export const isVoiceItem = (item?: Realtime.SpeakData): item is Realtime.SSMLData => item?.type === DialogType.VOICE;
