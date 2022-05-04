import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  type: BlockType.CAPTUREV2,
  icon: 'capture',

  mergeTerminator: true,

  factory: (_, { projectType, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH },
          },
        },
      },
    },
    data: {
      name: 'Capture',
      captureType: BaseNode.CaptureV2.CaptureType.INTENT,
      variable: null,
      intent: { slots: [{ id: '', dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false }, required: true }] },
      noReply: null,
      noMatch: getPlatformNoMatchFactory(projectType)({ defaultVoice }),
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
