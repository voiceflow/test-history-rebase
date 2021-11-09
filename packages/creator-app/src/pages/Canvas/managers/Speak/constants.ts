import { Utils } from '@voiceflow/common';
import { Icon } from '@voiceflow/ui';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

const NAME_MAP: Record<DialogType, string> = {
  [DialogType.AUDIO]: 'Audio',
  [DialogType.VOICE]: 'Speak',
};

const ICON_MAP: Record<DialogType, Icon> = {
  [DialogType.AUDIO]: 'volume',
  [DialogType.VOICE]: 'speak',
};

const ICON_COLOR_MAP: Record<DialogType, string> = {
  [DialogType.AUDIO]: '#f83f55',
  [DialogType.VOICE]: '#8f8e94',
};

export const AUDIO_MOCK_DATA = { dialogs: [{ id: '', type: DialogType.AUDIO as const, url: '' }], randomize: true };
export const VOICE_MOCK_DATA = { dialogs: [{ id: '', type: DialogType.VOICE as const, voice: '', content: '' }], randomize: true };

export const NODE_CONFIG: NodeConfig<NodeData.Speak> = {
  type: BlockType.SPEAK,

  getIcon: (data) => ICON_MAP[data?.dialogs[0]?.type ?? DialogType.VOICE],
  getIconColor: (data) => ICON_COLOR_MAP[data?.dialogs[0]?.type ?? DialogType.VOICE],

  factory: ({ dialogs: [data] = [] } = {}, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: NAME_MAP[data?.type ?? DialogType.VOICE],
      randomize: true,
      canvasVisibility: options?.canvasNodeVisibility,
      dialogs: [
        data?.type === DialogType.AUDIO
          ? {
              id: Utils.id.cuid.slug(),
              url: data?.url ?? '',
              type: DialogType.AUDIO,
              desc: data?.desc ?? '',
            }
          : {
              id: Utils.id.cuid.slug(),
              type: DialogType.VOICE,
              voice: data?.voice ?? options?.defaultVoice ?? '',
              content: data?.content ?? '',
            },
      ],
    },
  }),
};
