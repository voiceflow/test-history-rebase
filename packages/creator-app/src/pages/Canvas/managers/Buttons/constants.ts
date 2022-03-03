import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';

export const factory = (): BaseNode.Buttons.Button => ({ id: Utils.id.cuid.slug(), name: '', actions: [BaseNode.Buttons.ButtonAction.PATH] });

export enum ButtonAction {
  FOLLOW_PATH = 'FOLLOW_PATH',
  GO_TO_INTENT = 'GO_TO_INTENT',
}

export const BUTTON_OPTIONS = [
  { id: ButtonAction.FOLLOW_PATH, label: 'Follow Path' },
  { id: ButtonAction.GO_TO_INTENT, label: 'Go to Intent' },
];

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  type: BlockType.BUTTONS,
  icon: 'action',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [{}],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Buttons',
      noMatch: getPlatformNoMatchFactory(platform)({ defaultVoice }),
      buttons: [factory()],
      noReply: null,
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
