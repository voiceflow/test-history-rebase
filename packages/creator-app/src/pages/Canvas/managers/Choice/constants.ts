import { Models, Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';
import { distinctPlatformsData } from '@/utils/platform';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

export const MAX_CHOICE_ITEMS = 55;

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  type: BlockType.CHOICE,
  icon: 'choice',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [{}],
          builtIn: { [Models.PortType.NO_MATCH]: { label: Models.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Choice',
      else: getPlatformNoMatchFactory(platform)({ defaultVoice }),
      noReply: null,
      buttons: isChatbotPlatform(platform) ? buttonsFactory() : null,
      choices: [
        distinctPlatformsData({
          id: Utils.id.cuid.slug(),
          goTo: null,
          intent: null,
          action: Node.Interaction.ChoiceAction.PATH,
          mappings: [],
        }),
      ],
    },
  }),
};
