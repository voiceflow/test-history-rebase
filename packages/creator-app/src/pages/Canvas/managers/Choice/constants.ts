import { Node as BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchesFactory } from '@/utils/noMatches';
import { distinctPlatformsData } from '@/utils/platform';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Interaction> = {
  type: BlockType.CHOICE,

  icon: 'choice',
  iconColor: '#3a5999',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Choice',
      else: getPlatformNoMatchesFactory(platform)({ defaultVoice }),
      buttons: isChatbotPlatform(platform) ? buttonsFactory() : null,
      choices: [
        distinctPlatformsData({
          id: Utils.id.cuid.slug(),
          goTo: null,
          intent: null,
          action: BaseNode.Interaction.ChoiceAction.PATH,
          mappings: [],
        }),
      ],
      reprompt: null,
    },
  }),
};
