import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  type: BlockType.CAPTUREV2,

  icon: 'capture',
  iconColor: '#58457a',

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT }, [Models.PortType.NO_MATCH]: { label: Models.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Capture',
      captureType: Node.CaptureV2.CaptureType.INTENT,
      variable: null,
      intent: { slots: [{ id: '', dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false }, required: true }] },
      noReply: null,
      noMatch: getPlatformNoMatchFactory(platform)({ defaultVoice }),
    },
  }),
};
