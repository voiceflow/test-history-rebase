import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { NodeConfig } from '../types';
import { CHOICE_ICON } from './v2';

export const choiceFactory = (): Realtime.NodeData.InteractionChoice => ({
  id: Utils.id.cuid.slug(),
  goTo: null,
  intent: null,
  action: BaseNode.Interaction.ChoiceAction.PATH,
  mappings: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  type: BlockType.CHOICE,
  icon: CHOICE_ICON,

  mergeTerminator: true,

  factory: (_, { projectType, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },

    data: {
      name: 'Choice',
      noMatch: getPlatformNoMatchFactory(projectType)({ defaultVoice }),
      noReply: null,
      buttons: Realtime.Utils.typeGuards.isChatProjectType(projectType) ? buttonsFactory() : null,
      choices: [],
      intentScope: BaseNode.Utils.IntentScope.GLOBAL,
    },
  }),
};
