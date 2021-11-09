import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { getPlatformNoMatchesFactory } from '@/utils/noMatches';

import { NodeConfig } from '../types';

export const factory = (): Node.Buttons.Button => ({ id: Utils.id.cuid.slug(), name: '', actions: [Node.Buttons.ButtonAction.PATH] });

export enum ButtonAction {
  FOLLOW_PATH = 'FOLLOW_PATH',
  GO_TO_INTENT = 'GO_TO_INTENT',
}

export const BUTTON_OPTIONS = [
  { id: ButtonAction.FOLLOW_PATH, label: 'Follow Path' },
  { id: ButtonAction.GO_TO_INTENT, label: 'Go to Intent' },
];

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Buttons> = {
  type: BlockType.BUTTONS,

  icon: 'action',
  iconColor: '#3a5999',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Buttons',
      else: getPlatformNoMatchesFactory(platform)({ defaultVoice }),
      buttons: [factory()],
      reprompt: null,
    },
  }),
};
