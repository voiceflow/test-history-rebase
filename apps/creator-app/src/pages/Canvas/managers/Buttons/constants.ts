import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { emptyNoMatchFactory } from '@/utils/noMatch';

import type { NodeConfig } from '../types';

export const ADD_INTENTS_KEY = 'Buttons/constants:ADD_INTENTS';

export const buttonFactory = (): BaseNode.Buttons.Button => ({
  id: Utils.id.cuid.slug(),
  name: '',
  actions: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  type: BlockType.BUTTONS,
  icon: 'button',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [{}],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Buttons',
      noMatch: emptyNoMatchFactory(),
      buttons: [buttonFactory()],
      noReply: null,
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
