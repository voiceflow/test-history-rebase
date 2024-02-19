import * as Realtime from '@voiceflow/realtime-sdk';

export const isVoiceItem = (item?: Realtime.SpeakData): item is Realtime.SSMLData => item?.type === Realtime.DialogType.VOICE;
