import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';
import { distinctPlatformsData } from '@/utils/platform';

import { NodeConfig } from '../types';

export const MAX_CHOICE_ITEMS = 55;

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  type: BlockType.CHOICE,
  icon: 'choice',

  mergeTerminator: true,

  factory: (_, { platform, projectType, defaultVoice } = {}) => ({
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
      name: 'Choice',
      noMatch: getPlatformNoMatchFactory(projectType)({ defaultVoice }),
      noReply: null,
      buttons: Realtime.Utils.typeGuards.isChatPlatform(platform) ? buttonsFactory() : null,
      choices: [
        distinctPlatformsData({
          id: Utils.id.cuid.slug(),
          goTo: null,
          intent: null,
          action: BaseNode.Interaction.ChoiceAction.PATH,
          mappings: [],
        }),
      ],
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
