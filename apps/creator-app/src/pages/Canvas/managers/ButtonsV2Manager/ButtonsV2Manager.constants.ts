import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';
import { buttonItemFactory } from './ButtonsV2Manager.util';

export const BUTTONS_V2_NODE_CONFIG: NodeConfig<Realtime.NodeData.ButtonsV2> = {
  type: BlockType.BUTTONS_V2,
  icon: 'button',

  mergeTerminator: true,

  factory: () => {
    const buttonItem = buttonItemFactory();

    return {
      node: {
        ports: {
          in: [{}],
          out: {
            ...Realtime.Utils.port.createEmptyNodeOutPorts(),
            byKey: {
              [buttonItem.id]: { id: Utils.id.objectID(), label: '' },
            },
          },
        },
      },
      data: { name: 'Buttons', items: [buttonItem], listenForOtherTriggers: true },
    };
  },
};
