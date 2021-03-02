import cuid from 'cuid';

import { Icon } from '@/components/SvgIcon';
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

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Speak> = {
  type: BlockType.SPEAK,

  getIcon: (data) => ICON_MAP[data?.dialogs[0]?.type ?? DialogType.VOICE],
  getIconColor: (data) => ICON_COLOR_MAP[data?.dialogs[0]?.type ?? DialogType.VOICE],

  factory: (data, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: NAME_MAP[data?.dialogs?.[0]?.type ?? DialogType.VOICE],
      randomize: false,
      dialogs: [
        {
          id: cuid.slug(),
          type: data?.dialogs?.[0]?.type ?? DialogType.VOICE,
          voice: options?.defaultVoice ?? '',
          content: '',
        },
      ],
    },
  }),
};
