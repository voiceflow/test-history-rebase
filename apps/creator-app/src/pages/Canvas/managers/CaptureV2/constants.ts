import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { SystemVariable } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  type: BlockType.CAPTUREV2,
  icon: 'captureV2',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
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
      captureType: BaseNode.CaptureV2.CaptureType.QUERY,
      variable: SystemVariable.LAST_UTTERANCE,
      intent: { slots: [{ id: '', dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false }, required: true }] },
      noReply: null,
      noMatch: null,
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
