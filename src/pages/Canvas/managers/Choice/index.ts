import cuid from 'cuid';

import { BlockType, ChoiceElseType, DialogType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import ChoiceEditor from './ChoiceEditor';
import ChoiceStep from './ChoiceStep';
import { EDITORS_BY_PATH } from './subeditors';

const ChoiceManager: NodeConfig<NodeData.Interaction> = {
  type: BlockType.CHOICE,
  icon: 'choice',
  iconColor: '#3a5999',
  chips: true,
  reprompt: true,
  mergeTerminator: true,
  platformDependent: true,

  label: 'Choice',
  tip: 'Select choices and capture slot values from user input',

  step: ChoiceStep,
  editor: ChoiceEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Choice',
      choices: [
        {
          alexa: {
            id: cuid.slug(),
            intent: null,
            mappings: [],
          },
          google: {
            id: cuid.slug(),
            intent: null,
            mappings: [],
          },
        },
      ],
      reprompt: null,
      else: {
        type: ChoiceElseType.PATH,
        randomize: false,
        reprompts: [
          {
            id: cuid.slug(),
            type: DialogType.VOICE,
            voice: 'Alexa',
            content: '',
          },
        ],
      },
    },
  }),
};

export default ChoiceManager;
