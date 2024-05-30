import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import * as Documentation from '@/config/documentation';

import { NodeConfig } from '../types';

const NAME_MAP: Record<Realtime.DialogType, string> = {
  [Realtime.DialogType.AUDIO]: 'Audio',
  [Realtime.DialogType.VOICE]: 'Speak',
};

const ICON_MAP: Record<Realtime.DialogType, SvgIconTypes.Icon> = {
  [Realtime.DialogType.AUDIO]: 'audio',
  [Realtime.DialogType.VOICE]: 'systemMessage',
};

export const AUDIO_MOCK_DATA = { dialogs: [{ id: '', type: Realtime.DialogType.AUDIO as const, url: '' }], randomize: true };
export const VOICE_MOCK_DATA = { dialogs: [{ id: '', type: Realtime.DialogType.VOICE as const, voice: '', content: '' }], randomize: true };

export const getLabelByType = (type?: Realtime.DialogType): string => NAME_MAP[type ?? Realtime.DialogType.VOICE];

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = {
  type: Realtime.BlockType.SPEAK,

  getIcon: (data) => ICON_MAP[data?.dialogs[0]?.type ?? Realtime.DialogType.VOICE],

  getTooltipText: (data) =>
    data?.dialogs[0]?.type === Realtime.DialogType.AUDIO
      ? 'Plays short audio files (less than 240s).'
      : 'Text-to-speech messages spoken by the Voice agent.',

  getTooptipLink: (data) => (data?.dialogs[0]?.type === Realtime.DialogType.AUDIO ? Documentation.AUDIO_STEP : Documentation.SPEAK_STEP),

  factory: ({ dialogs: [data] = [] } = {}, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: NAME_MAP[data?.type ?? Realtime.DialogType.VOICE],
      randomize: true,
      canvasVisibility: options?.canvasNodeVisibility,
      dialogs: [
        data?.type === Realtime.DialogType.AUDIO
          ? {
              id: Utils.id.cuid.slug(),
              url: data?.url ?? '',
              type: Realtime.DialogType.AUDIO,
              desc: data?.desc ?? '',
            }
          : {
              id: Utils.id.cuid.slug(),
              type: Realtime.DialogType.VOICE,
              voice: data?.voice ?? options?.defaultVoice ?? '',
              content: data?.content ?? '',
            },
      ],
    },
  }),
} as const;
