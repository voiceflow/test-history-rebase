import { Node } from '@voiceflow/base-types';
import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Buttons> = {
  type: BlockType.BUTTONS,

  icon: 'action',
  iconColor: '#3a5999',

  mergeTerminator: true,

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Buttons',
      buttons: [{ id: cuid.slug(), name: '', actions: [Node.Buttons.ButtonAction.PATH] }],
      reprompt: null,
      else: {
        type: Node.Utils.NoMatchType.REPROMPT,
        pathName: 'No Match',
        randomize: false,
        reprompts: [
          {
            id: cuid.slug(),
            type: DialogType.VOICE,
            voice: options?.defaultVoice ?? '',
            content: '',
          },
        ],
      },
    },
  }),
};
