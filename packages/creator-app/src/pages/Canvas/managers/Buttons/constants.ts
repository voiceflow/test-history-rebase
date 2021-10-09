import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import cuid from 'cuid';

import { CheckboxOption } from '@/components/RadioGroup';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { getPlatformNoMatchesFactory } from '@/utils/noMatches';
import { createPlatformSelector } from '@/utils/platform';

import { NodeConfig } from '../types';

export const factory = (): Node.Buttons.Button => ({ id: cuid.slug(), name: '', actions: [Node.Buttons.ButtonAction.PATH] });

const PATH_BUTTON_OPTION = { id: Node.Buttons.ButtonAction.PATH, label: 'Path' };
const INTENT_BUTTON_OPTION = { id: Node.Buttons.ButtonAction.INTENT, label: 'Intent' };
const URL_BUTTON_OPTION = { id: Node.Buttons.ButtonAction.URL, label: 'URL' };

export const getButtonActions = createPlatformSelector<CheckboxOption<Node.Buttons.ButtonAction>[]>(
  {
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: [PATH_BUTTON_OPTION, INTENT_BUTTON_OPTION],
  },
  [PATH_BUTTON_OPTION, INTENT_BUTTON_OPTION, URL_BUTTON_OPTION]
);

export const NODE_CONFIG: NodeConfig<NodeData.Buttons> = {
  type: BlockType.BUTTONS,

  icon: 'action',
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
      name: 'Buttons',
      else: getPlatformNoMatchesFactory(platform)({ defaultVoice }),
      buttons: [factory()],
      reprompt: null,
    },
  }),
};
