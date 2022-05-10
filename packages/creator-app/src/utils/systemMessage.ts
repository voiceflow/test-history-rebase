import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import SlateEditable from '@/components/SlateEditable';
import { DialogType } from '@/constants';

export const speakMessageFactory = ({ defaultVoice }: { defaultVoice: string }): Realtime.SpeakData => ({
  id: Utils.id.cuid.slug(),
  type: DialogType.VOICE,
  voice: defaultVoice,
  content: '',
});

export const audioMessageFactory = (): Realtime.SpeakData => ({
  id: Utils.id.cuid.slug(),
  url: '',
  desc: '',
  type: DialogType.AUDIO,
});

export const textMessageFactory = (): BaseNode.Text.TextData => ({
  id: Utils.id.cuid.slug(),
  content: SlateEditable.EditorAPI.getEmptyState(),
});
