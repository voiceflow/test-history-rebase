import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { emptyNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';

export const choiceFactory = (): Realtime.NodeData.InteractionChoice => ({
  id: Utils.id.cuid.slug(),
  intent: null,
  mappings: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  type: BlockType.CHOICE,
  icon: 'choiceV2',

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
      name: 'Choice',
      noMatch: emptyNoMatchFactory(),
      noReply: null,
      buttons: null,
      choices: [choiceFactory()],
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
