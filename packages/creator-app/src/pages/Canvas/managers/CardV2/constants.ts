import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import SlateEditable from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  type: BlockType.CARDV2,
  icon: 'cardV2',
  isMergeTerminator: ({ data }) => Realtime.Utils.typeGuards.isCardV2NodeData(data) && Boolean(data.noMatch || data.noReply),

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH },
          },
        },
      },
    },
    data: {
      name: 'Card',
      title: '',
      description: options?.projectType === Platform.Constants.ProjectType.VOICE ? '' : SlateEditable.EditorAPI.getEmptyState(),
      imageUrl: '',
      buttons: [],
      noMatch: null,
      noReply: null,
    },
  }),
};
