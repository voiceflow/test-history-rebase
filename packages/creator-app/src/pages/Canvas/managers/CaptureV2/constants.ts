import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';
import { CAPTURE_STEP_ICON } from './v2';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  type: BlockType.CAPTUREV2,
  icon: CAPTURE_STEP_ICON,

  mergeTerminator: true,

  factory: (_, { projectType, defaultVoice } = {}) => ({
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
      captureType: BaseNode.CaptureV2.CaptureType.INTENT,
      variable: null,
      intent: { slots: [{ id: '', dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false }, required: true }] },
      noReply: null,
      noMatch: getPlatformNoMatchFactory(projectType)({ defaultVoice }),
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
